import { Router } from 'express';
import PainelController from '../controllers/painel.controller.js';
import { authenticator } from '../middlewares/auth.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Indicadores da visão geral (contagens e CO₂ do mês)
 *     tags: [Painel]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Indicadores }
 * /api/relatorios/emissoes:
 *   get:
 *     summary: Relatório de emissões de CO₂ por mês
 *     tags: [Painel]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Emissões e redução de CO₂ }
 * /api/relatorios/equipe:
 *   get:
 *     summary: Relatório de equipe (horas contratadas x horas em rota)
 *     tags: [Painel]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Horas e produtividade }
 */
router.get('/dashboard', authenticator, authorization('Gestor', 'Colaborador'), PainelController.dashboard);
router.get('/relatorios/emissoes', authenticator, authorization('Gestor'), PainelController.emissoes);
router.get('/relatorios/equipe', authenticator, authorization('Gestor'), PainelController.equipe);

export default router;
