import { Router } from 'express';
import UsuarioController from '../controllers/usuarios.controller.js';
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';

const router = Router();

router.get('/', UsuarioController.findAll);
router.post('/', validatorUsuarios, verificarErros, UsuarioController.create);
router.get('/:id', UsuarioController.findById);
router.put( '/:id', validarAtualizacaoUsuario, verificarErros, UsuarioController.put);
router.patch('/:id', validarAtualizacaoUsuario, verificarErros, UsuarioController.patch);
router.delete('/:id', UsuarioController.delete);

export default router;