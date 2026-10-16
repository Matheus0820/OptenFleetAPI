import { body } from 'express-validator';
import { campo } from './helpers.js';

const regras = (patch) => [
    // user_id só é informado na criação.
    ...(patch ? [] : [body('user_id').isMongoId().withMessage('user_id deve ser o ID de um usuário válido')]),
    campo(patch, 'funcao', 'A função')
        .isIn(['Ajudante', 'Técnico', 'Engenheiro', 'Estagiário'])
        .withMessage('A função deve ser: Ajudante, Técnico, Engenheiro ou Estagiário'),
    campo(patch, 'horaInicioExpediente', 'A hora de início do expediente')
        .isInt({ min: 0, max: 23 }).withMessage('A hora de início deve ser um inteiro entre 0 e 23').toInt(),
];

export const regrasValidacaoColaborador = regras(false);
export const regrasValidacaoColaboradorPatch = regras(true);
export default regrasValidacaoColaborador;
