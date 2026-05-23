import { body } from 'express-validator';

export const regrasValidacaoFrota = [
    // Marca
    body('marca')
        .trim()
        .notEmpty().withMessage('A marca do veículo é obrigatória')
        .isLength({ min: 2 }).withMessage('A marca deve ter no mínimo 2 caracteres'),

    // Ano de fabricação
    body('anoFabricacao')
        .notEmpty().withMessage('O ano de fabricação é obrigatório')
        .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
        .withMessage('Informe um ano de fabricação válido'),

    // Placa
    body('placa')
        .trim()
        .notEmpty().withMessage('A placa é obrigatória')
        .isLength({ min: 7, max: 8 }).withMessage('A placa deve ter entre 7 e 8 caracteres'),

    // Capacidade do tanque
    body('capacidadeMaximaTanque')
        .notEmpty().withMessage('A capacidade do tanque é obrigatória')
        .isFloat({ min: 1 }).withMessage('A capacidade do tanque deve ser maior que 0'),

    // Km por litro
    body('quilometroPorLitro')
        .notEmpty().withMessage('O consumo (km por litro) é obrigatório')
        .isFloat({ min: 0.1 }).withMessage('O consumo deve ser maior que 0')
];

export default regrasValidacaoFrota;