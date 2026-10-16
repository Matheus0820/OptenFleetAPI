// Lógica pura de planejamento (sem banco): monta a entrada do solver e interpreta o resultado.
import { co2Kg, litrosConsumidos, arredondar } from '../utils/co2.js';
import { TEMPO_SERVICO_PADRAO_MIN } from '../models/clientes.model.js';

// Dias úteis de execução por horizonte (seg–sex): diário 1, semanal 5, mensal 22.
export const DIAS_POR_HORIZONTE = { 'Diário': 1, 'Semanal': 5, 'Mensal': 22 };

const TURNO_PADRAO = { inicioH: 8, fimH: 17 };

export const hhmm = (min) =>
    `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

// Próximos N dias úteis a partir de `inicio` (inclusive), em UTC.
export function diasUteis(inicio, n) {
    const datas = [];
    const d = new Date(Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate()));
    while (datas.length < n) {
        if (![0, 6].includes(d.getUTCDay())) datas.push(new Date(d));
        d.setUTCDate(d.getUTCDate() + 1);
    }
    return datas;
}

// Turno comum da equipe = interseção dos expedientes (maior início, menor fim).
export function turnoDaEquipe(colaboradores) {
    if (!colaboradores.length) return { ...TURNO_PADRAO };
    const inicioH = Math.max(...colaboradores.map((c) => c.horaInicioExpediente));
    const fimH = Math.min(...colaboradores.map((c) => c.horaFimExpediente));
    return { inicioH, fimH };
}

export function montarEntrada({ deposito, clientes, veiculos, horizonte, turno, osrmUrl, timeLimit }) {
    return {
        depot: { lat: deposito.latitude, lng: deposito.longitude },
        clientes: clientes.map((c) => ({
            id: String(c.id),
            lat: c.latitude,
            lng: c.longitude,
            demanda: c.demanda ?? 1,
            servicoMin: c.tempoServicoMin ?? TEMPO_SERVICO_PADRAO_MIN[c.tipoServico] ?? 60,
            prazoDia: c.prazoDias ?? null,
            janelaInicioMin: (c.janelaInicio ?? 8) * 60,
            janelaFimMin: (c.janelaFim ?? 17) * 60,
        })),
        veiculos: veiculos.map((v) => ({
            id: String(v.id),
            capacidade: v.capacidadeCarga,
            alcanceKm: v.capacidadeMaximaTanque * v.quilometroPorLitro,
        })),
        dias: DIAS_POR_HORIZONTE[horizonte],
        turno: { inicioMin: turno.inicioH * 60, fimMin: turno.fimH * 60 },
        timeLimit,
        osrmUrl,
    };
}

export const urlRotaGoogleMaps = (deposito, paradas) =>
    'https://www.google.com/maps/dir/' +
    [deposito, ...paradas, deposito].map((p) => `${p.latitude},${p.longitude}`).join('/');

// Converte a saída do solver em dias/paradas/indicadores (distância, litros e CO₂ por veículo).
export function interpretarResultado({ resultado, deposito, clientes, veiculos, datas }) {
    const clientePorId = new Map(clientes.map((c) => [String(c.id), c]));
    const veiculoPorId = new Map(veiculos.map((v) => [String(v.id), v]));

    const dias = resultado.rotas
        .map((r) => {
            const v = veiculoPorId.get(r.veiculoId);
            const km = r.distanciaM / 1000;
            const paradas = r.paradas.map((p) => {
                const c = clientePorId.get(p.clienteId);
                return {
                    cliente: c.id, nome: c.nome, tipoServico: c.tipoServico,
                    latitude: c.latitude, longitude: c.longitude, urlMaps: c.urlMaps,
                    chegada: hhmm(p.chegadaMin), saida: hhmm(p.saidaMin),
                };
            });
            return {
                dia: r.dia, data: datas[r.dia - 1], veiculo: v.id, placa: v.placa, modelo: v.modelo,
                distanciaKm: arredondar(km), tempoMin: r.tempoMin,
                litros: arredondar(litrosConsumidos(km, v.quilometroPorLitro)),
                co2Kg: arredondar(co2Kg(km, v.quilometroPorLitro)),
                mapsUrl: urlRotaGoogleMaps(deposito, paradas), paradas,
            };
        })
        .sort((a, b) => a.dia - b.dia || a.placa.localeCompare(b.placa));

    const soma = (campo) => arredondar(dias.reduce((t, d) => t + d[campo], 0));
    const atendidos = dias.reduce((t, d) => t + d.paradas.length, 0);

    // Redução de CO₂ vs. atender cada cliente em viagem individual (ida e volta ao depósito).
    const usados = [...new Set(dias.map((d) => d.veiculo))].map((id) => veiculoPorId.get(String(id)));
    const kmlMedio = usados.length ? usados.reduce((t, v) => t + v.quilometroPorLitro, 0) / usados.length : 0;
    const baselineKm = (resultado.baselineDistanciaM ?? 0) / 1000;
    const kmRodados = dias.reduce((t, d) => t + d.distanciaKm, 0);
    const reducaoCo2Kg = arredondar(Math.max(0, co2Kg(baselineKm - kmRodados, kmlMedio)));

    return {
        dias,
        naoAtendidos: resultado.naoAtendidos.map((n) => ({
            cliente: clientePorId.get(n.clienteId).id, nome: clientePorId.get(n.clienteId).nome, motivo: n.motivo,
        })),
        resumo: {
            destinos: clientes.length,
            atendidos,
            naoAtendidos: resultado.naoAtendidos.length,
            veiculosUsados: usados.length,
            distanciaKm: soma('distanciaKm'),
            tempoMin: dias.reduce((t, d) => t + d.tempoMin, 0),
            litros: soma('litros'),
            co2Kg: soma('co2Kg'),
            reducaoCo2Kg,
        },
    };
}
