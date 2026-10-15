import ColaboradorRepository from '../repositories/colaboradores.repository.js';
import UsuarioRepository from '../repositories/usuarios.repository.js';
import { ColaboradorDto } from '../dtos/colaboradores.dto.js';
import { httpError, naoEncontrado } from '../utils/errors.js';

const JORNADA_ESTAGIARIO_H = 6;
const JORNADA_PADRAO_H = 8;

class ColaboradorService {
    static async findAll() {
        return (await ColaboradorRepository.findAll()).map((c) => new ColaboradorDto(c));
    }

    static async findById(id) {
        const colaborador = await ColaboradorRepository.findById(id);
        if (!colaborador) throw naoEncontrado('Colaborador');
        return new ColaboradorDto(colaborador);
    }

    // Regra de negócio: jornada definida pela função; fim = início + jornada.
    // O expediente não pode atravessar a meia-noite (as rotas são planejadas dentro de um único dia).
    static calcularDados({ funcao, horaInicioExpediente }) {
        const horasTrabalhoPorDia = funcao === 'Estagiário' ? JORNADA_ESTAGIARIO_H : JORNADA_PADRAO_H;
        const horaFimExpediente = Number(horaInicioExpediente) + horasTrabalhoPorDia;

        if (horaFimExpediente > 24) {
            throw httpError(422, `Início às ${horaInicioExpediente}h com jornada de ${horasTrabalhoPorDia}h ultrapassa a meia-noite. Informe um início até ${24 - horasTrabalhoPorDia}h.`);
        }
        return { horasTrabalhoPorDia, horaFimExpediente };
    }

    static async create(dados) {
        const calculado = this.calcularDados(dados);

        const usuario = await UsuarioRepository.findById(dados.user_id);
        if (!usuario) throw httpError(404, 'Usuário informado não existe.');
        if (usuario.nivelAcesso !== 'Colaborador') {
            throw httpError(403, 'Usuário informado não possui papel de Colaborador.');
        }
        if (await ColaboradorRepository.findByUserId(dados.user_id)) {
            throw httpError(409, 'Usuário informado já está cadastrado como colaborador.');
        }

        const novo = await ColaboradorRepository.create({
            user_id: dados.user_id,
            funcao: dados.funcao,
            horaInicioExpediente: dados.horaInicioExpediente,
            ...calculado,
        });
        return new ColaboradorDto(novo);
    }

    static async atualizar(dados, id) {
        const salvo = await ColaboradorRepository.findById(id);
        if (!salvo) throw naoEncontrado('Colaborador');

        const mesclado = {
            funcao: dados.funcao ?? salvo.funcao,
            horaInicioExpediente: dados.horaInicioExpediente ?? salvo.horaInicioExpediente,
        };
        const atualizado = await ColaboradorRepository.update({ ...mesclado, ...this.calcularDados(mesclado) }, id);
        return new ColaboradorDto(atualizado);
    }

    static put(dados, id) { return this.atualizar(dados, id); }
    static patch(dados, id) { return this.atualizar(dados, id); }

    static async delete(id) {
        const salvo = await ColaboradorRepository.findById(id);
        if (!salvo) throw naoEncontrado('Colaborador');
        await ColaboradorRepository.delete(id);
        return new ColaboradorDto(salvo);
    }
}

export default ColaboradorService;
