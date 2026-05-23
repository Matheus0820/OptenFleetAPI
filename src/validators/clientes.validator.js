import { body } from 'express-validator';

export const regrasValidacaoCliente = [
    // Regras para a validação
    body('nome')
        .trim()
        .notEmpty().withMessage('O nome do Cliente é obrigatório')
        .isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),
    
    body('tipoServico')
        .notEmpty().withMessage('O Tipo de Serviço é obrigatório')
        .isIn(['Instalação', 'Manutenção']).withMessage('O Tipo de Serviço deve ser: Instalação ou Manutenção'),
    
    body('urlMaps')
        .notEmpty().withMessage('A URL do Maps é obrigatória'),
];

export default regrasValidacaoCliente;