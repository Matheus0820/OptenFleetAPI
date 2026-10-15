import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const lerToken = (req) => {
    const [esquema, token] = (req.headers.authorization || '').split(' ');
    return esquema === 'Bearer' && token ? token : null;
};

export const authenticator = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const token = lerToken(req);
    if (!token) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    try {
        req.usuario = jwt.verify(token, env.jwtSecret);
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

// Identifica o usuário quando há token, mas não exige (ex.: cadastro público).
export const optionalAuthenticator = (req, res, next) => {
    if (!req.headers.authorization) return next();
    return authenticator(req, res, next);
};
