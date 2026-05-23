import { Router } from 'express';
import ColaboradorController from '../controllers/colaboradores.controller.js';
import validatorColaboradores from '../validators/colaboradores.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';

const router = Router();

router.get('/', ColaboradorController.findAll);
router.post('/', validatorColaboradores, verificarErros, ColaboradorController.create);
router.get('/:id', ColaboradorController.findById);
router.put('/:id', validatorColaboradores, verificarErros, ColaboradorController.put);
router.patch('/:id', validatorColaboradores, verificarErros, ColaboradorController.patch);
router.delete('/:id', ColaboradorController.delete);

export default router;