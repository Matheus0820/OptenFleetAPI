import express from 'express';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import { globalErrorHandler } from './middlewares/error.middleware.js';
import swaggerSpec from './config/swagger.js';

import routesColaboradores from './routes/colaboradores.routes.js';
import routesFrota from './routes/frota.routes.js';
import routesClientes from './routes/clientes.routes.js';
import routesUsuario from './routes/usuarios.routes.js';
import routesRotas from './routes/rotas.routes.js';
import routesPainel from './routes/painel.routes.js';
import routesAuth from './routes/auth.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public'); // build do Angular (ver Dockerfile)

const app = express();

app.disable('x-powered-by');
// Swagger UI usa scripts inline; o CSP restritivo fica por conta do front estático.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Força bruta no login: 20 tentativas / 15 min por IP.
app.use('/api/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));

app.get('/api/saude', (req, res) => res.json({ status: 'ok' }));
app.use('/api/colaboradores', routesColaboradores);
app.use('/api/frota', routesFrota);
app.use('/api/clientes', routesClientes);
app.use('/api/usuarios', routesUsuario);
app.use('/api/rotas', routesRotas);
app.use('/api', routesPainel);
app.use('/api', routesAuth);

app.use('/api', (req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

// Front Angular (SPA) servido pelo mesmo Express.
app.use(express.static(PUBLIC_DIR));
app.get(/^\/(?!api).*/, (req, res, next) => {
    const index = path.join(PUBLIC_DIR, 'index.html');
    fs.existsSync(index) ? res.sendFile(index) : next();
});

app.use(globalErrorHandler);

export default app;
