import { Router } from 'express';
import UsuarioController from '../controllers/usuarios.controller.js';
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

router.get('/', authenticator, authorization("Gestor"), UsuarioController.findAll);
router.post('/', validatorUsuarios, verificarErros, UsuarioController.create);
router.get('/:id', authenticator, authorization("Gestor"), UsuarioController.findById);
router.put( '/:id', authenticator, authorization("Gestor"), validarAtualizacaoUsuario, verificarErros, UsuarioController.put);
router.patch('/:id', authenticator, authorization("Gestor"), validarAtualizacaoUsuario, verificarErros, UsuarioController.patch);
router.delete('/:id', authenticator, authorization("Gestor"), UsuarioController.delete);

export default router;