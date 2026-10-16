import bcrypt from 'bcrypt';
import UsuarioRepository from '../repositories/usuarios.repository.js';
import ColaboradorRepository from '../repositories/colaboradores.repository.js';
import { UsuarioDto } from '../dtos/usuarios.dto.js';
import { httpError, naoEncontrado } from '../utils/errors.js';

const hash = (senha) => bcrypt.hash(senha, 10);

class UsuarioService {
    static async findAll() {
        return (await UsuarioRepository.findAll()).map((u) => new UsuarioDto(u));
    }

    static async findById(id) {
        const usuario = await UsuarioRepository.findById(id);
        if (!usuario) throw naoEncontrado('Usuário');
        return new UsuarioDto(usuario);
    }

    // Cadastro público (sem token) nunca cria Gestor. Exceção: o primeiro usuário do sistema
    // vira Gestor (bootstrap); depois, só um Gestor autenticado cria outro Gestor.
    static async create(dados, solicitante) {
        const primeiro = (await UsuarioRepository.count()) === 0;
        const ehGestor = solicitante?.nivelAcesso === 'Gestor';
        const nivelAcesso = primeiro ? 'Gestor' : ehGestor ? (dados.nivelAcesso ?? 'Colaborador') : 'Colaborador';

        const novo = await UsuarioRepository.create({
            nome: dados.nome,
            email: dados.email,
            nivelAcesso,
            senha: await hash(dados.senha),
        });
        return new UsuarioDto(novo);
    }

    static async atualizar(dados, id, solicitante) {
        const salvo = await UsuarioRepository.findById(id);
        if (!salvo) throw naoEncontrado('Usuário');

        const novoNivel = dados.nivelAcesso ?? salvo.nivelAcesso;
        if (salvo.nivelAcesso === 'Gestor' && novoNivel !== 'Gestor') {
            await this.garantirOutroGestor(id);
        }

        const update = { nome: dados.nome ?? salvo.nome, email: dados.email ?? salvo.email, nivelAcesso: novoNivel };
        if (dados.senha) update.senha = await hash(dados.senha);

        const atualizado = await UsuarioRepository.update(update, id);

        // Só quem tem nível Colaborador pode ter cadastro de colaborador.
        if (novoNivel !== 'Colaborador') await ColaboradorRepository.deleteByUserId(id);

        return new UsuarioDto(atualizado);
    }

    static put(dados, id, solicitante) { return this.atualizar(dados, id, solicitante); }
    static patch(dados, id, solicitante) { return this.atualizar(dados, id, solicitante); }

    static async delete(id, solicitante) {
        const salvo = await UsuarioRepository.findById(id);
        if (!salvo) throw naoEncontrado('Usuário');

        if (solicitante?.id === id) throw httpError(409, 'Você não pode remover o próprio usuário.');
        if (salvo.nivelAcesso === 'Gestor') await this.garantirOutroGestor(id);

        await ColaboradorRepository.deleteByUserId(id);
        await UsuarioRepository.delete(id);
        return new UsuarioDto(salvo);
    }

    // O sistema não pode ficar sem nenhum Gestor.
    static async garantirOutroGestor(idExcluido) {
        const outros = await UsuarioRepository.count({ nivelAcesso: 'Gestor', _id: { $ne: idExcluido } });
        if (outros === 0) throw httpError(409, 'Não é possível remover ou rebaixar o último Gestor do sistema.');
    }
}

export default UsuarioService;
