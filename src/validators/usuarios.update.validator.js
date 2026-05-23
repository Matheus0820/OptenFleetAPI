import { body } from 'express-validator';

export const validarAtualizacaoUsuario = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 2 }),

    body('email')
        .optional()
        .isEmail(),

    body('nivelAcesso')
        .optional()
        .isIn(['Colaborador', 'Gestor'])
];

export default validarAtualizacaoUsuario;