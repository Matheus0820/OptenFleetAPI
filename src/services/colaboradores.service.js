import ColaboradorRepository from '../repositories/colaboradores.repository.js';
import UsuarioRepository from '../repositories/usuarios.repository.js';
import { ColaboradorDto } from '../dtos/colaboradores.dto.js';

class ColaboradorService {

    static async findAll() {
        const colaboradores = await ColaboradorRepository.findAll();

        return colaboradores.map(
            colaborador => new ColaboradorDto(colaborador)
        );
    }

    static async findById(id) {
        const colaborador = await ColaboradorRepository.findById(id);

        if (!colaborador) {
            throw Object.assign(
                new Error('Colaborador com ID informado não existe.'),
                { statusCode: 404 }
            );
        }

        return new ColaboradorDto(colaborador);
    }

    // Função interna para recalcular os dados
    static calcularDados(colaboradorData) {
        let horasTrabalhoPorDiaCalc = 0;

        if (["Ajudante", "Técnico", "Engenheiro"].includes(colaboradorData.funcao)) {
            horasTrabalhoPorDiaCalc = 8;
        } else {
            horasTrabalhoPorDiaCalc = 6;
        }

        let horaFimExpedienteCalc =
            Number(colaboradorData.horaInicioExpediente) + horasTrabalhoPorDiaCalc;

        if (horaFimExpedienteCalc > 24) {
            horaFimExpedienteCalc = horaFimExpedienteCalc % 24;
        }

        return {
            horasTrabalhoPorDia: horasTrabalhoPorDiaCalc,
            horaFimExpediente: horaFimExpedienteCalc
        };
    }

    static async create(colaboradorData) {
        const calculado = this.calcularDados(colaboradorData);
        const user_id = colaboradorData.user_id;

        // Veficando se usuário existe
        const hasUser = await UsuarioRepository.findById(user_id);


        if(!hasUser) {
            throw Object.assign(
                new Error("Usuário informado não existe."),
                { statusCode: 404 }
            );
            
        }

        // Verificando se o nível de acesso desse usuário é de Colaborador
        if(hasUser.nivelAcesso != 'Colaborador') {
            throw Object.assign(
                new Error("Usuário informado não possui papel de Colaborador."),
                {statusCode: 403}
            );
            
        }

        // Verificando se já existe um colaborador para o usuário informado
        const getColaboradores = await ColaboradorRepository.findAll();
        const hasColaborador = getColaboradores.find(colaborador => colaborador.user_id === user_id);

        if(hasColaborador) {
            throw Object.assign(
                new Error("Usuário informado já está cadastrado como colaborador."),
                { statusCode: 409 }
            );
            
        }

        const newColaboradorData = {
            user_id: colaboradorData.user_id,
            funcao: colaboradorData.funcao,
            horaInicioExpediente: colaboradorData.horaInicioExpediente,
            horaFimExpediente: calculado.horaFimExpediente,
            horasTrabalhoPorDia: calculado.horasTrabalhoPorDia
        };

        console.log("Service - Colaborador");
        console.log(newColaboradorData);

        const newColaboradorFromDb =
            await ColaboradorRepository.create(newColaboradorData);

        return new ColaboradorDto(newColaboradorFromDb);
    }

    static async put(colaboradorData, id) {
        const colaboradorSalvo = await ColaboradorRepository.findById(id);

        if (!colaboradorSalvo) {
            throw Object.assign(
                new Error('Colaborador com ID informado não existe.'),
                { statusCode: 404 }
            );
        }

        const calculado = this.calcularDados(colaboradorData);

        const updateData = {
            funcao: colaboradorData.funcao,
            horaInicioExpediente: colaboradorData.horaInicioExpediente,
            horaFimExpediente: calculado.horaFimExpediente,
            horasTrabalhoPorDia: calculado.horasTrabalhoPorDia
        };

        const colaboradorUpdateDb =
            await ColaboradorRepository.update(updateData, id);

        return new ColaboradorDto(colaboradorUpdateDb);
    }

    static async patch(colaboradorData, id) {
        const colaboradorSalvo = await ColaboradorRepository.findById(id);

        if (!colaboradorSalvo) {
            throw Object.assign(
                new Error('Colaborador com ID informado não existe.'),
                { statusCode: 404 }
            );
        }

        const mergedData = {
            funcao: colaboradorData.funcao ?? colaboradorSalvo.funcao,
            horaInicioExpediente:
                colaboradorData.horaInicioExpediente ??
                colaboradorSalvo.horaInicioExpediente
        };

        const calculado = this.calcularDados(mergedData);

        const updateData = {
            funcao: mergedData.funcao,
            horaInicioExpediente: mergedData.horaInicioExpediente,
            horaFimExpediente: calculado.horaFimExpediente,
            horasTrabalhoPorDia: calculado.horasTrabalhoPorDia
        };

        const colaboradorUpdateDb =
            await ColaboradorRepository.update(updateData, id);

        return new ColaboradorDto(colaboradorUpdateDb);
    }

    static async delete(id) {
        const colaboradorDelete = await ColaboradorRepository.findById(id);

        if (!colaboradorDelete) {
            throw Object.assign(
                new Error('Colaborador com ID informado não existe.'),
                { statusCode: 404 }
            );
        }

        await ColaboradorRepository.delete(id);

        return new ColaboradorDto(colaboradorDelete);
    }
}

export default ColaboradorService;