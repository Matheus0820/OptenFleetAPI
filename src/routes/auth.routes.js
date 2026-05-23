import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';

const router = Router();

router.post('/login', AuthController.login);

export default router;