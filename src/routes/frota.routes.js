import { Router } from 'express';
import FrotaController from '../controllers/frota.controller.js';
import validatorFrota from '../validators/frota.entidades.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', authenticator, authorization("Gestor", "Colaborador"), FrotaController.findAll);
router.post('/', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.create);
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), FrotaController.findById);
router.put('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.put);
router.patch('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.patch);
router.delete('/:id', authenticator, authorization("Gestor", "Colaborador"), FrotaController.delete);

export default router;