import { body } from 'express-validator';
import { campo } from './helpers.js';

const regras = (patch) => [
    campo(patch, 'nome', 'O nome do Cliente').trim().isLength({ min: 2 }).withMessage('O nome deve ter no mínimo 2 caracteres'),
    campo(patch, 'tipoServico', 'O Tipo de Serviço').isIn(['Instalação', 'Manutenção']).withMessage('O Tipo de Serviço deve ser: Instalação ou Manutenção'),
    campo(patch, 'urlMaps', 'A URL do Maps').trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('A URL do Maps deve ser um link http(s) válido'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida').toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida').toFloat(),
    body('demanda').optional().isInt({ min: 1 }).withMessage('A demanda deve ser um inteiro maior que 0').toInt(),
    body('tempoServicoMin').optional().isInt({ min: 5, max: 600 }).withMessage('O tempo de serviço deve estar entre 5 e 600 minutos').toInt(),
    body('prazoDias').optional({ nullable: true }).isInt({ min: 1, max: 31 }).withMessage('O prazo deve estar entre 1 e 31 dias úteis').toInt(),
    body('janelaInicio').optional().isInt({ min: 0, max: 23 }).withMessage('janelaInicio deve estar entre 0 e 23').toInt(),
    body('janelaFim').optional().isInt({ min: 1, max: 24 }).withMessage('janelaFim deve estar entre 1 e 24').toInt(),
    body(['janelaInicio', 'janelaFim']).custom((_, { req }) => {
        const { janelaInicio: i, janelaFim: f } = req.body;
        return i === undefined || f === undefined || i < f;
    }).withMessage('janelaInicio deve ser menor que janelaFim'),
];

export const regrasValidacaoCliente = regras(false);
export const regrasValidacaoClientePatch = regras(true);
export default regrasValidacaoCliente;
