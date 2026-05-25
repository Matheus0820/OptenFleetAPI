import { Router } from 'express';
import ClienteController from '../controllers/clientes.controller.js';
import validatorClientes from '../validators/clientes.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       description: Representa um cliente cadastrado no sistema
 *       required:
 *         - nome
 *         - tipoServico
 *         - urlMaps
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do cliente gerado automaticamente pela API
 *           example: deb79176-727e-486a-951a-6552bf7df632
 *         nome:
 *           type: string
 *           description: "Nome completo do cliente"
 *           example: "José Manuel"
 *         tipoServico:
 *           type: string
 *           description: "Tipo de serviço solicitado pelo cliente (ex: Manutenção, Instalação)"
 *           example: "Manutenção"
 *         urlMaps:
 *           type: string
 *           description: "Link do Google Maps referente à localização do cliente"
 *           example: "https://maps.app.goo.gl/U5qHXzbL9YicqC2dA"
 *
 *     ClienteCreate:
 *       type: object
 *       description: Estrutura utilizada para criação de um novo cliente
 *       required:
 *         - nome
 *         - tipoServico
 *         - urlMaps
 *       properties:
 *         nome:
 *           type: string
 *           description: "Nome completo do cliente"
 *           example: "José Manuel"
 *         tipoServico:
 *           type: string
 *           description: "Tipo de serviço solicitado pelo cliente (ex: Manutenção, Instalação)"
 *           example: "Manutenção"
 *         urlMaps:
 *           type: string
 *           description: "Link do Google Maps referente à localização do cliente"
 *           example: "https://maps.app.goo.gl/U5qHXzbL9YicqC2dA"
 *
 *     ClienteUpdate:
 *       type: object
 *       description: Estrutura utilizada para atualização parcial de um cliente
 *       properties:
 *         nome:
 *           type: string
 *           description: "Nome completo do cliente"
 *         tipoServico:
 *           type: string
 *           description: "Tipo de serviço solicitado pelo cliente"
 *         urlMaps:
 *           type: string
 *           description: "Link do Google Maps referente à localização do cliente"
 *
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 */
router.get('/', authenticator, authorization("Gestor", "Colaborador"), ClienteController.findAll);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteCreate'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 */
router.post('/', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.create);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     tags: [Clientes]
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
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), ClienteController.findById);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualiza completamente um cliente
 *     tags: [Clientes]
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
 *             $ref: '#/components/schemas/ClienteCreate'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.put);

/**
 * @swagger
 * /api/clientes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um cliente
 *     tags: [Clientes]
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
 *             $ref: '#/components/schemas/ClienteUpdate'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 */
router.patch('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorClientes, verificarErros, ClienteController.patch);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
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
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:id', authenticator, authorization("Gestor", "Colaborador"), ClienteController.delete);

export default router;