import { body } from 'express-validator';

export const regrasValidacaoUsuario = [
    // Nome
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome do usuário é obrigatório')
        .isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),

    // E-mail
    body('email')
        .trim()
        .notEmpty().withMessage('O e-mail é obrigatório')
        .isEmail().withMessage('Informe um e-mail válido'),

    // Nível de acesso
    body('nivelAcesso')
        .notEmpty().withMessage('O nível de acesso é obrigatório')
        .isIn(['Colaborador', 'Gestor'])
        .withMessage('O nível de acesso deve ser: Colaborador ou Gestor'),

    // Senha
    body('senha')
        .notEmpty().withMessage('A senha é obrigatória')
        .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres')
        .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
];

export default regrasValidacaoUsuario;