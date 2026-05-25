import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import { globalErrorHandler } from './middlewares/error.middleware.js';
import swaggerSpec from './swagger.js';
 
import routesColaboradores from './routes/colaboradores.routes.js';
import routesFrota from './routes/frota.routes.js';
import routesClientes from './routes/clientes.routes.js';
import routesUsuario from './routes/usuarios.routes.js';
import routesWeb from './routes/web.routes.js';
import routesAuth from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/colaboradores', routesColaboradores);
app.use('/api/frota', routesFrota);
app.use('/api/clientes', routesClientes);
app.use('/api/usuarios', routesUsuario);
app.use('/api', routesAuth);

app.use('/', routesWeb);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(globalErrorHandler);

export default app;