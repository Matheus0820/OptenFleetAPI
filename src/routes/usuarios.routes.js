import { Router } from 'express';
import UsuarioController from '../controllers/usuarios.controller.js';
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticator, UsuarioController.findAll);
router.post('/', authenticator, validatorUsuarios, verificarErros, UsuarioController.create);
router.get('/:id', authenticator, UsuarioController.findById);
router.put( '/:id', authenticator, validarAtualizacaoUsuario, verificarErros, UsuarioController.put);
router.patch('/:id', authenticator, validarAtualizacaoUsuario, verificarErros, UsuarioController.patch);
router.delete('/:id', authenticator, UsuarioController.delete);

export default router;