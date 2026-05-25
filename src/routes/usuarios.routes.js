import { Router } from 'express';
import UsuarioController from '../controllers/usuarios.controller.js';
import validatorUsuarios from '../validators/usuarios.validator.js';
import validarAtualizacaoUsuario from '../validators/usuarios.update.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gestão de usuários do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       description: Representa um usuário cadastrado no sistema
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - nivelAcesso
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do usuário gerado automaticamente pela API
 *           example: bf411103-5271-4756-8981-dc2822724432
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *           example: Matheus Ramos
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: matheus.ramos@email.com
 *         nivelAcesso:
 *           type: string
 *           description: "Nível de acesso do usuário (ex: Gestor, Colaborador)"
 *           example: Gestor
 *
 *     UsuarioCreate:
 *       type: object
 *       description: Estrutura utilizada para criação de um novo usuário
 *       required:
 *         - nome
 *         - email
 *         - senha
 *         - nivelAcesso
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *           example: Maria Oliveira
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: maria@email.com
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *           example: 12345678
 *         nivelAcesso:
 *           type: string
 *           description: "Nível de acesso do usuário (ex: Gestor, Colaborador)"
 *           example: Colaborador
 *
 *     UsuarioUpdate:
 *       type: object
 *       description: Estrutura utilizada para atualização parcial ou total de um usuário
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *           example: João Pedro
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: joao@email.com
 *         nivelAcesso:
 *           type: string
 *           description: "Nível de acesso do usuário (ex: Gestor, Colaborador)"
 *           example: Gestor
 *
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 */
router.get('/', authenticator, authorization("Gestor"), UsuarioController.findAll);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação
 */
router.post('/', validatorUsuarios, verificarErros, UsuarioController.create);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticator, authorization("Gestor"), UsuarioController.findById);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza completamente um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  '/:id',
  authenticator,
  authorization("Gestor"),
  validarAtualizacaoUsuario,
  verificarErros,
  UsuarioController.put
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Usuário não encontrado
 */
router.patch(
  '/:id',
  authenticator,
  authorization("Gestor"),
  validarAtualizacaoUsuario,
  verificarErros,
  UsuarioController.patch
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authenticator, authorization("Gestor"), UsuarioController.delete);

export default router;