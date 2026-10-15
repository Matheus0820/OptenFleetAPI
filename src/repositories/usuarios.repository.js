import Usuario from '../models/usuarios.model.js';
import { crudRepository } from './crud.repository.js';

export default class UsuarioRepository extends crudRepository(Usuario) {
    // senha tem select:false; só o login precisa dela.
    static findByEmailComSenha(email) {
        return Usuario.findOne({ email: String(email).trim().toLowerCase() }).select('+senha');
    }

    // O service já carregou o usuário, então basta remover (sem findAndModify).
    static async delete(id) { await Usuario.deleteOne({ _id: id }); }

    static async update(data, id) {
        await Usuario.updateOne({ _id: id }, data, { runValidators: true });
        return Usuario.findById(id);
    }
}
