import { Router } from 'express';
import ColaboradorController from '../controllers/colaboradores.controller.js';
import validatorColaboradores from '../validators/colaboradores.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Colaboradores
 *   description: Gestão de colaboradores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Colaborador:
 *       type: object
 *       description: Representa um colaborador cadastrado no sistema
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID gerado automaticamente pela API
 *           example: 7af9cac0-deb8-4ece-b579-b54c138e4222
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: "ID do usuário associado ao colaborador"
 *           example: ce0609b9-a489-437a-9069-691f56b9b7f9
 *         funcao:
 *           type: string
 *           description: "Função do colaborador (ex: Ajudante, Técnico, Engenheiro, Estagiário)"
 *           example: "Ajudante"
 *         horaInicioExpediente:
 *           type: number
 *           description: "Hora de início do expediente (ex: 9)"
 *           example: 9
 *         horaFimExpediente:
 *           type: number
 *           description: "Hora de fim do expediente (calculado automaticamente pelo service)"
 *           example: 17
 *         horasTrabalhoPorDia:
 *           type: number
 *           description: "Total de horas trabalhadas por dia (calculado automaticamente pelo service)"
 *           example: 8
 *       required:
 *         - user_id
 *         - funcao
 *         - horaInicioExpediente
 *
 *     ColaboradorCreate:
 *       type: object
 *       description: Estrutura utilizada para criação de um colaborador
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: "ID do usuário associado ao colaborador"
 *           example: ce0609b9-a489-437a-9069-691f56b9b7f9
 *         funcao:
 *           type: string
 *           description: "Função do colaborador (ex: Ajudante, Técnico, Engenheiro, Estagiário)"
 *           example: "Ajudante"
 *         horaInicioExpediente:
 *           type: number
 *           description: "Hora de início do expediente (ex: 9)"
 *           example: 9
 *       required:
 *         - user_id
 *         - funcao
 *         - horaInicioExpediente
 *
 *     ColaboradorUpdate:
 *       type: object
 *       description: Estrutura utilizada para atualização parcial ou total de um colaborador
 *       properties:
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: "ID do usuário associado ao colaborador"
 *           example: ce0609b9-a489-437a-9069-691f56b9b7f9
 *         funcao:
 *           type: string
 *           description: "Função do colaborador (ex: Ajudante, Técnico, Engenheiro, Estagiário)"
 *           example: "Técnico"
 *         horaInicioExpediente:
 *           type: number
 *           description: "Hora de início do expediente (ex: 8)"
 *           example: 8
 */

/**
 * @swagger
 * /api/colaboradores:
 *   get:
 *     summary: Lista todos os colaboradores
 *     tags: [Colaboradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de colaboradores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colaborador'
 */
router.get('/', authenticator, authorization("Gestor", "Colaborador"), ColaboradorController.findAll);

/**
 * @swagger
 * /api/colaboradores:
 *   post:
 *     summary: Cria um novo colaborador
 *     tags: [Colaboradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColaboradorCreate'
 *     responses:
 *       201:
 *         description: Colaborador criado com sucesso
 */
router.post('/', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.create);

/**
 * @swagger
 * /api/colaboradores/{id}:
 *   get:
 *     summary: Busca colaborador por ID
 *     tags: [Colaboradores]
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
 *         description: Colaborador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colaborador'
 */
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), ColaboradorController.findById);

/**
 * @swagger
 * /api/colaboradores/{id}:
 *   put:
 *     summary: Atualiza completamente um colaborador
 *     tags: [Colaboradores]
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
 *             $ref: '#/components/schemas/ColaboradorCreate'
 *     responses:
 *       200:
 *         description: Colaborador atualizado com sucesso
 */
router.put('/:id', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.put);

/**
 * @swagger
 * /api/colaboradores/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um colaborador
 *     tags: [Colaboradores]
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
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               funcao:
 *                 type: string
 *               horaInicioExpediente:
 *                 type: number
 *     responses:
 *       200:
 *         description: Colaborador atualizado parcialmente com sucesso
 */
router.patch('/:id', authenticator, authorization("Gestor"), validatorColaboradores, verificarErros, ColaboradorController.patch);

/**
 * @swagger
 * /api/colaboradores/{id}:
 *   delete:
 *     summary: Remove um colaborador
 *     tags: [Colaboradores]
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
 *         description: Colaborador removido com sucesso
 */
router.delete('/:id', authenticator, authorization("Gestor"), ColaboradorController.delete);

export default router;