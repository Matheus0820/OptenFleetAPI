import { Router } from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import validatorClientes from '../validators/clientes.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';


const router = Router();

router.get('/', authenticator, ClienteController.findAll);
router.post('/', authenticator, validatorClientes, verificarErros, ClienteController.create);
router.get('/:id', authenticator, ClienteController.findById);
router.put('/:id', authenticator, validatorClientes, verificarErros, ClienteController.put);
router.patch('/:id', authenticator, validatorClientes, verificarErros, ClienteController.patch);
router.delete('/:id', authenticator, ClienteController.delete);

export default router;