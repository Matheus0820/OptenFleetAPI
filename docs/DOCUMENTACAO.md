# Documentação técnica — Opten Fleet

## 1. Arquitetura

```
Angular (public/) ──HTTP /api──► Express 5 ──► MongoDB (Mongoose)
                                   │
                                   └─ spawn ─► Python (solver/solve.py, OR-Tools)   stdin/stdout JSON
```

Camadas do back: `routes → validators → controllers → services → repositories → models`, com DTOs de saída.
Lógica pura de planejamento em `src/services/planejamento.js` (testável sem banco).
Docker: `Dockerfile` multi-stage (build Angular → `node:22-bookworm-slim` + venv Python com `ortools`), `docker-compose.yml` (app + `mongo:7`).

**Express vs Next:** mantido Express. O front é Angular; Next seria um segundo framework de servidor redundante.

## 2. Regras de negócio

- **Perfis:** Gestor (tudo) e Colaborador (leitura de clientes, rotas, dashboard, colaboradores). Primeiro usuário = Gestor; signup público = Colaborador; o último Gestor não pode ser removido/rebaixado; remover usuário remove seu cadastro de colaborador.
- **Colaborador:** jornada 6 h (Estagiário) ou 8 h (demais); fim do expediente ≤ 24 h.
- **Frota:** autonomia = tanque × km/L; categoria Insumos|Pessoas; capacidade de carga.
- **Cliente:** coordenadas via lat/lng ou extraídas da URL do Google Maps; demanda; tempo de serviço (Instalação 120 / Manutenção 60 min); janela de atendimento (padrão 8–17 h); **prazo em dias úteis (`prazoDias`)**, opcional.
- **Horizontes:** Diário = 1, Semanal = 5, Mensal = 22 dias úteis. Turno = interseção dos expedientes dos colaboradores (padrão 8–17).
- **CO₂:** 2,3 kg/L; redução = viagem individual ida/volta por cliente − rota otimizada.

## 3. Solver (VRPTW + CVRP)

Cada (veículo, dia) é um *slot*. Restrições: capacidade, janela de tempo + turno, autonomia por dia, prazo do cliente (só slots de dia ≤ prazo). Clientes inatendíveis são reportados em `naoAtendidos` (disjunção com penalidade), sem falhar a rota. Custos fixos por slot concentram a frota e antecipam atendimentos para os primeiros dias. Matriz via OSRM, com *fallback* haversine. Meta-heurística GUIDED_LOCAL_SEARCH, limite de tempo configurável (`SOLVER_TIME_LIMIT`).

**Desvio em relação ao artigo:** o artigo resolve semana/mês de forma iterativa (vetor cliente→dia, mutação, menor objetivo global). Aqui o modelo é **conjunto multi-dia** (uma única otimização). Uma variante iterativa é possível como evolução.

## 4. Endpoints (`/api`, Swagger em `/api-docs`)

`POST /login` · `GET /saude` · `/usuarios`, `/colaboradores`, `/frota`, `/clientes` (CRUD, PUT/PATCH) · `GET|POST /rotas`, `GET|DELETE /rotas/:id` · `GET /dashboard`, `/relatorios/emissoes`, `/relatorios/equipe`.

## 5. Segurança e correções feitas

helmet, rate limit no login (20/15 min), JWT obrigatório com segredo validado na subida, senha `select:false`, bcrypt com hash fictício contra *timing*, limite de JSON. Removidos `teste.js` (**continha credencial do Atlas — ainda no histórico git: troque a senha**), lowdb/pug/uuid e views.
Bugs corrigidos: validators sem PATCH, cascata de usuário→colaborador, soma do dashboard, IDs inválidos → 400, datas em UTC no front.

## 6. Testes

15 testes (`npm test`): regras, CO₂, planejamento, solver real (capacidade, janela, autonomia, antecipação, prazo), autenticação/autorização. E2E de 16 passos validado com FerretDB.

## 7. Limitações conhecidas

Ver [MATRIZ_RASTREABILIDADE.md](../MATRIZ_RASTREABILIDADE.md).
