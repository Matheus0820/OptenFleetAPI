import { validationResult } from 'express-validator';

export const verificarErros = (req, res, next) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({
            sucesso: false,
            erros: erros.array()
        });
    }
    next();
};

export default verificarErros;