import { Router } from 'express';
import WebController from '../controllers/web.controller.js';
import { authenticator } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', WebController.listAllPage);
router.get('/clientes', WebController.listClientesPage);
router.get('/colaboradores', WebController.listColaboradoresPage);
router.get('/frota', WebController.listFrotaPage);
router.get('/usuarios', authenticator, WebController.listUsuariosPage);
router.get('/login', WebController.loginUser);

export default router;