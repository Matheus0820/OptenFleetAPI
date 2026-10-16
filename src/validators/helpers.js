import { body } from 'express-validator';

// Em PATCH os campos são opcionais; em POST/PUT são obrigatórios.
export const campo = (patch, nome, rotulo) => {
    const c = body(nome);
    return patch ? c.optional() : c.exists({ values: 'falsy' }).withMessage(`${rotulo} é obrigatório`).bail();
};
