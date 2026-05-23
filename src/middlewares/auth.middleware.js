import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET
export const authenticator = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return next(new Error("Token não informado"))
    }

    const token = authHeader.split(" ")[1];

    if(!token) {
        return next(new Error("Token inválido"));
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.usuario = payload;
        next();
        
    } catch(error) {
        next(new Error("Token inválido ou expirado"));
    }
}