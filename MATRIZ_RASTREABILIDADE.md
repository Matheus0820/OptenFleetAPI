# Matriz de rastreabilidade — Opten Fleet

**Última tarefa concluída:** prazo por cliente (`prazoDias`) ponta a ponta (modelo, validator, DTO, solver, front, Swagger, teste) + rebuild do front + documentação. Testes: 15 unitários e 16 e2e passando.

| ID | Requisito | Implementação | Teste | Status |
|----|-----------|---------------|-------|--------|
| RF01 | Autenticação JWT e perfis Gestor/Colaborador | `auth.middleware.js`, `usuarios.service.js`, rotas | `api.test.js`, e2e | ✅ |
| RF02 | CRUD usuários/colaboradores/frota/clientes | `src/{routes,services,repositories,models}` | e2e | ✅ |
| RF03 | Coordenadas do cliente via URL do Maps | `utils/maps.js`, `clientes.service.js` | `regras.test.js` | ✅ |
| RF04 | Roteirização VRPTW+CVRP multi-veículo | `solver/solve.py`, `planejamento.js` | `planejamento.test.js` | ✅ |
| RF05 | Horizontes diário/semanal/mensal | `DIAS_POR_HORIZONTE`, slots veículo×dia | `planejamento.test.js` | ✅ |
| RF06 | Autonomia do tanque limita a rota | dimensão de distância | `planejamento.test.js` | ✅ |
| RF07 | Prazo do cliente | `prazoDias` → `prazoDia` → solver | `planejamento.test.js` | ✅ |
| RF08 | Clientes inatendíveis reportados | disjunção + `naoAtendidos` | `planejamento.test.js` | ✅ |
| RF09 | CO₂ e redução vs. viagem individual | `utils/co2.js` | `regras.test.js` | ✅ |
| RF10 | Dashboard e relatórios | `painel.service.js` | e2e | ✅ |
| RF11 | Front Angular a partir da demo | `web/` | e2e visual (Playwright) | ✅ |
| RNF01 | Container único + compose | `Dockerfile`, `docker-compose.yml` | — | ⚠️ não buildado aqui |

## Pendências

- Rodar `docker compose up --build` (sem daemon no ambiente de desenvolvimento).
- Validar com MongoDB real e OSRM real (usado FerretDB e haversine).
- **Trocar a senha do Atlas** exposta no histórico git (`teste.js`).
- Telas de edição (PUT/PATCH) no Angular.
- Geração de rotas assíncrona (fila/jobs); limite do solver 10 s vs. 300 s do notebook.
- Variante iterativa semanal/mensal do artigo (hoje: modelo conjunto).
- Vínculo colaborador↔veículo (equipe) não modelado.
- Links do Google Maps limitam número de waypoints.
- Refresh token, CI, testes unitários do front.
- Rótulo "Emissão CO₂/h" da demo vs. fórmula por km (UI usa CO₂/km).
