import { body } from 'express-validator';

export const regrasValidacaoColaborador = [
    // Regras para a validação
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome do Colaborador é obrigatório')
        .isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),

    body('funcao')
        .notEmpty().withMessage('A função é obrigatória')
        .isIn(['Ajudante', 'Técnico', 'Engenheiro', 'Estagiário'])
        .withMessage('A função deve ser: Ajudante, Técnico, Engenheiro ou Estagiário'),

    body('horaInicioExpediente')
        .notEmpty().withMessage('A hora de início do expediente é obrigatória'),
];

export default regrasValidacaoColaborador;