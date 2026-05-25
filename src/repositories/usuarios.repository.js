import db from '../config/database.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class UsuarioRepository {

    static async findAll() {
        db.read();
        return db.data.usuarios;
    }

    static async findById(id) {
        db.read();
        return db.data.usuarios.find(u => u.id === id);
    }

    static async create(usuarioData) {
        global._crypto = crypto;
        db.read();

        const newUsuario = {
            id: uuidv4(),
            nome: usuarioData.nome,
            email: usuarioData.email,
            nivelAcesso: usuarioData.nivelAcesso,
            senha: usuarioData.senha
        };

        db.data.usuarios.push(newUsuario);
        await db.write();

        return newUsuario;
    }

    static async update(usuarioData, id) {
        db.read();

        const usuario = db.data.usuarios.find(u => u.id === id);

        usuario.nome = usuarioData.nome;
        usuario.email = usuarioData.email;
        usuario.nivelAcesso = usuarioData.nivelAcesso;

        await db.write();

        return usuario;
    }

    static async delete(id) {
        db.read();

        const indexUsuario = db.data.usuarios.findIndex(u => u.id === id);

        const usuarioRemovido = db.data.usuarios[indexUsuario];

        db.data.usuarios.splice(indexUsuario, 1);
        await db.write();

        return usuarioRemovido;
    }
}

export default UsuarioRepository;