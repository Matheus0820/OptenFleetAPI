import { Router } from 'express';
import FrotaController from '../controllers/frota.controller.js';
import validatorFrota from '../validators/frota.entidades.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', FrotaController.findAll);

router.post('/', authenticator, validatorFrota, verificarErros, FrotaController.create);

router.get('/:id', authenticator, FrotaController.findById);

router.put('/:id', authenticator, validatorFrota, verificarErros, FrotaController.put);

router.patch('/:id', authenticator, validatorFrota, verificarErros, FrotaController.patch);

router.delete('/:id', authenticator, FrotaController.delete);

export default router;