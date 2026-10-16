import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import UsuarioRepository from '../repositories/usuarios.repository.js';
import { UsuarioDto } from '../dtos/usuarios.dto.js';
import { httpError } from '../utils/errors.js';

// Hash fictício para gastar o mesmo tempo quando o e-mail não existe (evita enumeração por timing).
const HASH_FALSO = bcrypt.hashSync('opten-fleet-timing', 10);

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, senha } = req.body ?? {};
            if (typeof email !== 'string' || typeof senha !== 'string') {
                throw httpError(400, 'Informe email e senha.');
            }

            const usuario = await UsuarioRepository.findByEmailComSenha(email);
            const senhaOk = await bcrypt.compare(senha, usuario?.senha ?? HASH_FALSO);
            if (!usuario || !senhaOk) throw httpError(401, 'Credenciais inválidas');

            const payload = { id: usuario.id, login: usuario.email, nome: usuario.nome, nivelAcesso: usuario.nivelAcesso };
            const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '1h' });

            res.status(200).json({
                message: 'Login realizado com sucesso',
                token_user: token,
                usuario: new UsuarioDto(usuario),
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
