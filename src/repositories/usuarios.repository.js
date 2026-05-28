import Usuario from '../models/usuarios.model.js';
import crypto from 'crypto';

class UsuarioRepository {

    static async findAll() {
        const usuarios = await Usuario.find();
        return usuarios;
    }

    static async findById(id) {
        const usuario = await Usuario.findById(id);
        return usuario;
    }

    static async create(usuarioData) {
        const newUsuario = new Usuario(usuarioData);
        await newUsuario.save();
        return newUsuario;
    }

    static async update(usuarioData, id) {
        const usuario = await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
        return usuario;
    }

    static async delete(id) {
        const usuario = await Usuario.findByIdAndDelete(id);
        return usuario;
    }
}

export default UsuarioRepository;