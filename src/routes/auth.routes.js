import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autentica o usuário no sistema
 *     tags:
 *       - Autenticação
 *     description: Realiza o login do usuário e retorna um token de autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@teste.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/login', AuthController.login);

export default router;