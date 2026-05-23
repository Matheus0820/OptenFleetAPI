import { Router } from 'express';
import WebController from '../controllers/web.controller.js';

const router = Router();

router.get('/', WebController.listAllPage);
router.get('/clientes', WebController.listClientesPage);
router.get('/colaboradores', WebController.listColaboradoresPage);
router.get('/frota', WebController.listFrotaPage);
router.get('/usuarios', WebController.listUsuariosPage);

export default router;