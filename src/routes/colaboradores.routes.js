import { Router } from 'express';
import ColaboradorController from '../controllers/colaboradores.controller.js';
import validatorColaboradores from '../validators/colaboradores.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', authenticator, authorization("Gestor", "Colaborador"), ColaboradorController.findAll);
router.post('/', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.create);
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), ColaboradorController.findById);
router.put('/:id', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.put);
router.patch('/:id', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.patch);
router.delete('/:id', authenticator, authorization("Gestor"), ColaboradorController.delete);

export default router;