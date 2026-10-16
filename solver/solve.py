"""Solver Opt.en Fleet: VRPTW + CVRP com Google OR-Tools.

Contrato: lê um JSON da entrada padrão e escreve um JSON na saída padrão.
Baseado nos notebooks 5 e 6 do projeto, com estas diferenças deliberadas:
  * horizonte multi-dia: cada (veículo, dia) vira um "veículo" do modelo (slot);
  * autonomia: a distância percorrida por slot é limitada ao alcance do tanque;
  * tempo de serviço contado na SAÍDA do nó (o notebook o somava na chegada);
  * disjunções com penalidade: o que não couber é reportado em `naoAtendidos`
    em vez de o modelo falhar por inteiro (ROUTING_FAIL nos casos de 50/200 clientes);
  * matriz via OSRM com queda automática para estimativa haversine.

Entrada:
  depot {lat,lng}; clientes [{id,lat,lng,demanda,servicoMin,janelaInicioMin,janelaFimMin}]
  veiculos [{id,capacidade,alcanceKm}]; dias; turno {inicioMin,fimMin}
  timeLimit (s); osrmUrl ('' desativa)
"""
import json
import math
import sys
import urllib.request

from ortools.constraint_solver import pywrapcp, routing_enums_pb2

PENALIDADE_NAO_ATENDER = 10_000_000  # metros-equivalentes: atender sempre vale mais que economizar km
CUSTO_FIXO_SLOT = 20_000             # metros-equivalentes: prefere concentrar atendimentos em menos dias/veículos
CUSTO_POR_DIA_ADIADO = 1_000         # metros-equivalentes por dia de espera: antecipa os atendimentos
VELOCIDADE_MEDIA_KMH = 30.0          # estimativa urbana quando o OSRM não responde
FATOR_DESVIO = 1.3                   # distância viária ~ 1,3x a linha reta
BLOCO_OSRM = 50


def haversine_m(a, b):
    r = 6371000.0
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    dphi, dl = p2 - p1, math.radians(b[1] - a[1])
    h = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def matriz_haversine(coords):
    n = len(coords)
    dist = [[0] * n for _ in range(n)]
    tempo = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                d = haversine_m(coords[i], coords[j]) * FATOR_DESVIO
                dist[i][j] = round(d)
                tempo[i][j] = round(d / (VELOCIDADE_MEDIA_KMH / 3.6))
    return dist, tempo


def matriz_osrm(coords, base_url):
    """Matriz N x N (metros, segundos) em blocos, como no notebook 6."""
    n = len(coords)
    dist = [[0] * n for _ in range(n)]
    tempo = [[0] * n for _ in range(n)]
    blocos = [list(range(i, min(i + BLOCO_OSRM, n))) for i in range(0, n, BLOCO_OSRM)]
    for origens in blocos:
        for destinos in blocos:
            pts = [coords[i] for i in origens] + [coords[j] for j in destinos]
            path = ";".join(f"{lng},{lat}" for lat, lng in pts)
            src = ";".join(str(i) for i in range(len(origens)))
            dst = ";".join(str(len(origens) + j) for j in range(len(destinos)))
            url = f"{base_url.rstrip('/')}/table/v1/driving/{path}?sources={src}&destinations={dst}&annotations=duration,distance"
            with urllib.request.urlopen(url, timeout=20) as resp:
                data = json.load(resp)
            if data.get("code") != "Ok":
                raise RuntimeError(f"OSRM: {data.get('code')}")
            for a, o in enumerate(origens):
                for b, d in enumerate(destinos):
                    dd, tt = data["distances"][a][b], data["durations"][a][b]
                    if dd is None or tt is None:
                        raise RuntimeError("OSRM: trecho sem rota")
                    dist[o][d], tempo[o][d] = round(dd), round(tt)
    return dist, tempo


def obter_matriz(coords, osrm_url):
    if osrm_url:
        try:
            d, t = matriz_osrm(coords, osrm_url)
            return d, t, "osrm"
        except Exception as exc:  # rede indisponível, limite do servidor público etc.
            print(f"[solver] OSRM indisponível ({exc}); usando haversine", file=sys.stderr)
    d, t = matriz_haversine(coords)
    return d, t, "haversine"


def resolver(entrada):
    depot = entrada["depot"]
    clientes = entrada["clientes"]
    veiculos = entrada["veiculos"]
    dias = max(1, int(entrada.get("dias", 1)))
    turno_ini, turno_fim = entrada["turno"]["inicioMin"] * 60, entrada["turno"]["fimMin"] * 60  # em segundos
    limite = int(entrada.get("timeLimit", 10))

    coords = [(depot["lat"], depot["lng"])] + [(c["lat"], c["lng"]) for c in clientes]
    dist_m, tempo_s, fonte = obter_matriz(coords, entrada.get("osrmUrl", ""))
    n = len(coords)

    # Slots = veículos x dias. slot k -> veículo k % V, dia k // V.
    n_veic = len(veiculos)
    n_slots = n_veic * dias
    capacidades = [int(veiculos[k % n_veic]["capacidade"]) for k in range(n_slots)]
    alcances = [int(veiculos[k % n_veic]["alcanceKm"] * 1000) for k in range(n_slots)]

    manager = pywrapcp.RoutingIndexManager(n, n_slots, 0)
    routing = pywrapcp.RoutingModel(manager)

    def cb_dist(i, j):
        return dist_m[manager.IndexToNode(i)][manager.IndexToNode(j)]

    idx_dist = routing.RegisterTransitCallback(cb_dist)
    routing.SetArcCostEvaluatorOfAllVehicles(idx_dist)
    # Custo fixo por (veículo, dia) usado: concentra em poucos slots e prefere os primeiros dias.
    for k in range(n_slots):
        routing.SetFixedCostOfVehicle(CUSTO_FIXO_SLOT + (k // n_veic) * CUSTO_POR_DIA_ADIADO, k)

    # Capacidade (CVRP)
    demandas = [0] + [int(c["demanda"]) for c in clientes]
    idx_dem = routing.RegisterUnaryTransitCallback(lambda i: demandas[manager.IndexToNode(i)])
    routing.AddDimensionWithVehicleCapacity(idx_dem, 0, capacidades, True, "Demanda")

    # Autonomia: distância por slot limitada ao alcance do tanque (reabastece à noite).
    routing.AddDimensionWithVehicleCapacity(idx_dist, 0, alcances, True, "Distancia")

    # Tempo (VRPTW): deslocamento + serviço na origem.
    servico = [0] + [int(c["servicoMin"]) * 60 for c in clientes]

    def cb_tempo(i, j):
        a, b = manager.IndexToNode(i), manager.IndexToNode(j)
        return tempo_s[a][b] + servico[a]

    idx_tempo = routing.RegisterTransitCallback(cb_tempo)
    routing.AddDimension(idx_tempo, 3600 * 6, turno_fim, False, "Tempo")
    dim_t = routing.GetDimensionOrDie("Tempo")

    nao_atendiveis = []
    for pos, c in enumerate(clientes, start=1):
        ini = max(turno_ini, int(c["janelaInicioMin"]) * 60)
        fim = min(turno_fim, int(c["janelaFimMin"]) * 60)
        idx = manager.NodeToIndex(pos)
        # Precisa chegar, ser atendido e ainda voltar ao depósito dentro do turno.
        ultima_saida_viavel = turno_fim - servico[pos] - tempo_s[pos][0]
        fim = min(fim, ultima_saida_viavel)
        if ini > fim or tempo_s[0][pos] + turno_ini > fim:
            nao_atendiveis.append((pos, "Fora da janela/turno ou longe demais para o expediente"))
            routing.AddDisjunction([idx], 0)  # liberado: não entra em nenhuma rota
            routing.VehicleVar(idx).SetValues([-1])
            continue
        dim_t.CumulVar(idx).SetRange(ini, fim)
        prazo = c.get("prazoDia")
        if prazo:  # só slots de dia <= prazo podem atender este cliente
            routing.VehicleVar(idx).RemoveValues([k for k in range(n_slots) if k // n_veic >= int(prazo)])
        routing.AddDisjunction([idx], PENALIDADE_NAO_ATENDER)

    for k in range(n_slots):
        dim_t.CumulVar(routing.Start(k)).SetRange(turno_ini, turno_fim)
        dim_t.CumulVar(routing.End(k)).SetRange(turno_ini, turno_fim)
        routing.AddVariableMinimizedByFinalizer(dim_t.CumulVar(routing.Start(k)))
        routing.AddVariableMinimizedByFinalizer(dim_t.CumulVar(routing.End(k)))

    params = pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    params.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    params.time_limit.seconds = limite

    solucao = routing.SolveWithParameters(params)
    if solucao is None:
        return {"status": "SEM_SOLUCAO", "fonteMatriz": fonte, "rotas": [],
                "naoAtendidos": [{"clienteId": c["id"], "motivo": "Sem solução viável"} for c in clientes]}

    rotas, atendidos = [], set()
    for k in range(n_slots):
        idx = routing.Start(k)
        paradas, dist_total = [], 0
        while not routing.IsEnd(idx):
            nxt = solucao.Value(routing.NextVar(idx))
            no = manager.IndexToNode(idx)
            if no != 0:
                chegada = solucao.Value(dim_t.CumulVar(idx))
                paradas.append({
                    "clienteId": clientes[no - 1]["id"],
                    "chegadaMin": round(chegada / 60),
                    "saidaMin": round((chegada + servico[no]) / 60),
                })
                atendidos.add(no)
            dist_total += dist_m[no][manager.IndexToNode(nxt)]
            idx = nxt
        if not paradas:
            continue
        rotas.append({
            "veiculoId": veiculos[k % n_veic]["id"],
            "dia": k // n_veic + 1,
            "paradas": paradas,
            "distanciaM": dist_total,
            "tempoMin": round((solucao.Value(dim_t.CumulVar(idx)) - solucao.Value(dim_t.CumulVar(routing.Start(k)))) / 60),
        })

    motivos = dict(nao_atendiveis)
    nao_atendidos = [
        {"clienteId": clientes[p - 1]["id"],
         "motivo": motivos.get(p, "Sem capacidade, autonomia ou janela disponível no horizonte")}
        for p in range(1, n) if p not in atendidos
    ]
    # Referência de comparação: cada cliente atendido em viagem individual ida-e-volta.
    base_m = sum(dist_m[0][p] + dist_m[p][0] for p in atendidos)

    return {"status": "OK", "fonteMatriz": fonte, "rotas": rotas,
            "naoAtendidos": nao_atendidos, "baselineDistanciaM": base_m}


if __name__ == "__main__":
    try:
        print(json.dumps(resolver(json.load(sys.stdin))))
    except Exception as exc:
        print(json.dumps({"status": "ERRO", "mensagem": str(exc)}))
        sys.exit(1)
