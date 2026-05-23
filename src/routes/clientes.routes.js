import { Router } from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import validatorClientes from '../validators/clientes.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';


const router = Router();

router.get('/', ClienteController.findAll);
router.post('/', validatorClientes, verificarErros, ClienteController.create);
router.get('/:id', ClienteController.findById);
router.put('/:id', validatorClientes, verificarErros, ClienteController.put);
router.patch('/:id', validatorClientes, verificarErros, ClienteController.patch);
router.delete('/:id', ClienteController.delete);

export default router;