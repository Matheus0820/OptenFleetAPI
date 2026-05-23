import { Router } from 'express';
import ColaboradorController from '../controllers/colaboradores.controller.js';
import validatorColaboradores from '../validators/colaboradores.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticator, ColaboradorController.findAll);
router.post('/', authenticator, validatorColaboradores, verificarErros, ColaboradorController.create);
router.get('/:id', authenticator, ColaboradorController.findById);
router.put('/:id', authenticator, validatorColaboradores, verificarErros, ColaboradorController.put);
router.patch('/:id', authenticator, validatorColaboradores, verificarErros, ColaboradorController.patch);
router.delete('/:id', authenticator, ColaboradorController.delete);

export default router;