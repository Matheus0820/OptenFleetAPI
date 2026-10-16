# Opten Fleet

Plataforma SaaS de roteirização para empresas de instalação/manutenção de energia solar fotovoltaica.
Um único container sobe **Angular (front) + Express (API) + Python/OR-Tools (solver)**; o MongoDB é um serviço do compose.

## Como rodar

```bash
cp .env.example .env          # defina JWT_SECRET (>=16 caracteres)
docker compose up --build     # http://localhost:3000  |  Swagger: /api-docs
docker compose exec app node scripts/seed.mjs   # dados de demonstração (gestor@opten.com / senha123)
```

O primeiro usuário cadastrado vira **Gestor**; cadastros públicos seguintes são **Colaborador**.

Sem Docker: `npm install`, `python -m venv .venv && .venv/bin/pip install -r solver/requirements.txt`,
`cd web && npm install && npx ng build` (copie `web/dist/*/browser/*` para `public/`), `npm start`.
Dev do front: `cd web && npm start` (proxy `/api` → `:3000`).

## Testes

`npm test` (unitários + solver real) · `npm run test:e2e` (API no ar, 16 passos).

## Documentação

- [docs/DOCUMENTACAO.md](docs/DOCUMENTACAO.md) — arquitetura, regras de negócio, endpoints, decisões.
- [MATRIZ_RASTREABILIDADE.md](MATRIZ_RASTREABILIDADE.md) — requisitos × código × testes, última tarefa e pendências.
