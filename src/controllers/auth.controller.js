import jwt from 'jsonwebtoken';
import UsuarioService from '../services/usuarios.service.js';

class AuthController {
    static async login(req, res, next) {
        try {
            const dataLogin = req.body
            const usersDto = await UsuarioService.findAll();

            const userLogin = usersDto.find(user => user.email === dataLogin.email && user.senha === dataLogin.senha)

            if(!userLogin) {
                return next(new Error("Credênciais inválidas"))
            }

            const payload = {
                id: userLogin.id,
                login: userLogin.email
            }

            // Criando token
            const JWT_SECRET = "secret_jwt"
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