import { Router } from 'express';
import FrotaController from '../controllers/frota.controller.js';
import validatorFrota from '../validators/frota.entidades.js';
import verificarErros from '../middlewares/validator.middleware.js';

const router = Router();

router.get('/', FrotaController.findAll);

router.post(
    '/',
    validatorFrota,
    verificarErros,
    FrotaController.create
);

router.get('/:id', FrotaController.findById);

router.put(
    '/:id',
    validatorFrota,
    verificarErros,
    FrotaController.put
);

router.patch(
    '/:id',
    validatorFrota,
    verificarErros,
    FrotaController.patch
);

router.delete('/:id', FrotaController.delete);

export default router;