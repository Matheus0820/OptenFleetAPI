import { body } from 'express-validator';
import { campo } from './helpers.js';

const regras = (patch) => [
    campo(patch, 'nome', 'O nome do usuário').trim().isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),
    campo(patch, 'email', 'O e-mail').trim().isEmail().withMessage('Informe um e-mail válido'),
    // No cadastro público o nível é ignorado (vira Colaborador); só Gestor define nível.
    body('nivelAcesso').optional().isIn(['Colaborador', 'Gestor']).withMessage('O nível de acesso deve ser: Colaborador ou Gestor'),
    campo(patch, 'senha', 'A senha')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
        .matches(/\d/).withMessage('A senha deve conter pelo menos um número'),
];

export const regrasValidacaoUsuario = regras(false);
export const regrasValidacaoUsuarioPatch = regras(true);
export default regrasValidacaoUsuario;
