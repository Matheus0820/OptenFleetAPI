import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import UsuarioService from '../services/usuarios.service.js';

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
    static async login(req, res, next) {
        try {
            const dataLogin = req.body
            const usersDto = await UsuarioService.findAll();

            const userLogin = usersDto.find(user => user.email === dataLogin.email)

            if(!userLogin) {
                throw Object.assign(
                    new Error('Credênciais Inválidas'),
                    { statusCode: 401 }
                );
            }

            const passValidate = await bcrypt.compare(dataLogin.senha, userLogin.senha);

            if(!passValidate) {
                throw Object.assign(
                    new Error('Credênciais Inválidas'),
                    { statusCode: 401 }
                );
            }

            const payload = {
                id: userLogin.id,
                login: userLogin.email,
                nivelAcesso: userLogin.nivelAcesso
            }

            // Criando token
            const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "1h"});
            
            return res.status(200).json({
                message: "Login realizando com sucesso",
                token_user: token
            });

        } catch(error) {
            next(error);
        }
    }
}

export default AuthController;