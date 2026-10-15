import { Router } from 'express';
import RotaController from '../controllers/rotas.controller.js';
import validatorRotas from '../validators/rotas.validator.js';
import verificarErros from '../middlewares/validator.middleware.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RotaGerar:
 *       type: object
 *       required: [nome, horizonte]
 *       properties:
 *         nome: { type: string, example: Rota Solar A1 }
 *         horizonte: { type: string, enum: [Diário, Semanal, Mensal] }
 *         dataInicio: { type: string, format: date, description: "Padrão: hoje. Dias úteis (seg–sex) a partir desta data." }
 *         clienteIds: { type: array, items: { type: string }, description: "Padrão: todos os clientes" }
 *         veiculoIds: { type: array, items: { type: string }, description: "Padrão: toda a frota" }
 *         colaboradorIds: { type: array, items: { type: string }, description: "Define o turno (interseção dos expedientes). Padrão: todos" }
 */

/**
 * @swagger
 * /api/rotas:
 *   get:
 *     summary: Lista as rotas geradas (resumo)
 *     tags: [Rotas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de rotas }
 *   post:
 *     summary: Gera uma rota otimizada (VRPTW + CVRP com OR-Tools)
 *     description: |
 *       Considera capacidade do veículo, autonomia do tanque, janela de atendimento dos clientes,
 *       turno comum dos colaboradores e o horizonte (Diário=1, Semanal=5, Mensal=22 dias úteis).
 *       Clientes que não couberem no horizonte são devolvidos em `naoAtendidos`.
 *     tags: [Rotas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RotaGerar' }
 *     responses:
 *       201: { description: Rota gerada e salva }
 *       400: { description: Erro de validação }
 *       422: { description: Dados insuficientes ou sem solução viável }
 *       429: { description: Solver ocupado }
 */
router.get('/', authenticator, authorization('Gestor', 'Colaborador'), RotaController.findAll);
router.post('/', authenticator, authorization('Gestor'), validatorRotas, verificarErros, RotaController.gerar);

/**
 * @swagger
 * /api/rotas/{id}:
 *   get:
 *     summary: Detalha uma rota (dias, paradas, horários, CO₂ e link do Google Maps)
 *     tags: [Rotas]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Rota }
 *       404: { description: Rota não encontrada }
 *   delete:
 *     summary: Remove uma rota
 *     tags: [Rotas]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Rota removida }
 *       404: { description: Rota não encontrada }
 */
router.get('/:id', authenticator, authorization('Gestor', 'Colaborador'), RotaController.findById);
router.delete('/:id', authenticator, authorization('Gestor'), RotaController.delete);

export default router;
