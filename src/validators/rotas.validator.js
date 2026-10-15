import { body } from 'express-validator';

export const regrasValidacaoRota = [
    body('nome').trim().isLength({ min: 2 }).withMessage('O nome da rota é obrigatório'),
    body('horizonte').isIn(['Diário', 'Semanal', 'Mensal']).withMessage('O horizonte deve ser: Diário, Semanal ou Mensal'),
    body('dataInicio').optional().isISO8601().withMessage('dataInicio deve ser uma data ISO (AAAA-MM-DD)'),
    ...['clienteIds', 'veiculoIds', 'colaboradorIds'].flatMap((c) => [
        body(c).optional().isArray({ min: 1 }).withMessage(`${c} deve ser uma lista não vazia`),
        body(`${c}.*`).optional().isMongoId().withMessage(`${c} deve conter IDs válidos`),
    ]),
];

export default regrasValidacaoRota;
