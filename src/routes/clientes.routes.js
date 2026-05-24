import { Router } from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import validatorClientes from '../validators/clientes.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';


const router = Router();

router.get('/', authenticator, authorization("Gestor", "Colaborador"), ClienteController.findAll);
router.post('/', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.create);
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), ClienteController.findById);
router.put('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.put);
router.patch('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.patch);
router.delete('/:id', authenticator, authorization("Gestor", "Colaborador"), ClienteController.delete);

export default router;