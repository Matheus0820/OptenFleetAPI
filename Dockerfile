# syntax=docker/dockerfile:1
# Opt.en Fleet — um único container: Express (API + front Angular estático) + solver Python (OR-Tools).

# ---------- 1) build do front Angular ----------
FROM node:22-bookworm-slim AS web
WORKDIR /web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npx ng build --configuration production

# ---------- 2) imagem final ----------
FROM node:22-bookworm-slim
ENV NODE_ENV=production \
    PORT=3000 \
    PYTHON_BIN=/opt/venv/bin/python

# Python + OR-Tools em venv isolado (o Node chama o solver como processo filho)
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 python3-venv \
 && rm -rf /var/lib/apt/lists/*
COPY solver/requirements.txt /tmp/requirements.txt
RUN python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY solver ./solver
COPY --from=web /web/dist/opten-fleet-web/browser ./public

USER node
EXPOSE 3000
# Qualquer resposta HTTP (inclusive 404 JSON) indica que o servidor está de pé.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/saude').then(()=>process.exit(0),()=>process.exit(1))"
CMD ["node", "src/server.js"]
