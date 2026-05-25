import { Router } from 'express';
import FrotaController from '../controllers/frota.controller.js';
import validatorFrota from '../validators/frota.entidades.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Frota
 *   description: Gestão de veículos da frota
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Frota:
 *       type: object
 *       description: Representa um veículo cadastrado na frota da empresa
 *       required:
 *         - marca
 *         - anoFabricacao
 *         - placa
 *         - capacidadeMaximaTanque
 *         - quilometroPorLitro
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do veículo gerado automaticamente pela API
 *           example: e148a777-eba7-48e3-bd83-30c2010ae552
 *         marca:
 *           type: string
 *           description: Marca do veículo
 *           example: Volkswagen
 *         anoFabricacao:
 *           type: number
 *           description: Ano de fabricação do veículo
 *           example: 2021
 *         placa:
 *           type: string
 *           description: Placa do veículo
 *           example: ABC1D23
 *         capacidadeMaximaTanque:
 *           type: number
 *           description: Capacidade máxima do tanque em litros
 *           example: 65
 *         quilometroPorLitro:
 *           type: number
 *           description: Consumo médio do veículo em km por litro
 *           example: 13.5
 *
 *     FrotaCreate:
 *       type: object
 *       description: Estrutura utilizada para criação de um veículo
 *       required:
 *         - marca
 *         - anoFabricacao
 *         - placa
 *         - capacidadeMaximaTanque
 *         - quilometroPorLitro
 *       properties:
 *         marca:
 *           type: string
 *           example: Volkswagen
 *         anoFabricacao:
 *           type: number
 *           example: 2021
 *         placa:
 *           type: string
 *           example: ABC1D23
 *         capacidadeMaximaTanque:
 *           type: number
 *           example: 65
 *         quilometroPorLitro:
 *           type: number
 *           example: 13.5
 *
 *     FrotaUpdate:
 *       type: object
 *       description: Estrutura para atualização parcial ou total de veículo
 *       properties:
 *         marca:
 *           type: string
 *           example: Fiat
 *         anoFabricacao:
 *           type: number
 *           example: 2023
 *         placa:
 *           type: string
 *           example: CDF2H34
 *         capacidadeMaximaTanque:
 *           type: number
 *           example: 80
 *         quilometroPorLitro:
 *           type: number
 *           example: 15
 *
 */

/**
 * @swagger
 * /api/frota:
 *   get:
 *     summary: Lista todos os veículos da frota
 *     tags: [Frota]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veículos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Frota'
 */
router.get('/', authenticator, authorization("Gestor", "Colaborador"), FrotaController.findAll);

/**
 * @swagger
 * /api/frota:
 *   post:
 *     summary: Cria um novo veículo na frota
 *     tags: [Frota]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FrotaCreate'
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 */
router.post('/', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.create);

/**
 * @swagger
 * /api/frota/{id}:
 *   get:
 *     summary: Busca veículo por ID
 *     tags: [Frota]
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
 *         description: Veículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Frota'
 *       404:
 *         description: Veículo não encontrado
 */
router.get('/:id', authenticator, authorization("Gestor", "Colaborador"), FrotaController.findById);

/**
 * @swagger
 * /api/frota/{id}:
 *   put:
 *     summary: Atualiza completamente um veículo
 *     tags: [Frota]
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
 *             $ref: '#/components/schemas/FrotaCreate'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 */
router.put('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.put);

/**
 * @swagger
 * /api/frota/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um veículo
 *     tags: [Frota]
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
 *             $ref: '#/components/schemas/FrotaUpdate'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 */
router.patch('/:id', authenticator, authorization("Gestor", "Colaborador"), validatorFrota, verificarErros, FrotaController.patch);

/**
 * @swagger
 * /api/frota/{id}:
 *   delete:
 *     summary: Remove um veículo da frota
 *     tags: [Frota]
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
 *         description: Veículo removido com sucesso
 */
router.delete('/:id', authenticator, authorization("Gestor", "Colaborador"), FrotaController.delete);

export default router;