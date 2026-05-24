import db from '../config/database.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class ColaboradorRepository {
    static async findAll() {
        db.read();

        const allColaboradores = db.data.colaboradores;
        return allColaboradores;
    }

    static async findById(id) {
        db.read();

        const colaborador = await db.data.colaboradores.find(colaborador => colaborador.id === id);

        return colaborador;
    }

    static async create(colaboradorData) {
        global.crypto = crypto;
        db.read();

        const newColaborador = {
            id: uuidv4(),
            user_id: colaboradorData.user_id,
            funcao: colaboradorData.funcao, // Pode ser Ajudante, Técnico, Engenheiro, Estagiário
            horaInicioExpediente: colaboradorData.horaInicioExpediente,
            horaFimExpediente: colaboradorData.horaFimExpediente,
            horasTrabalhoPorDia: colaboradorData.horasTrabalhoPorDia
        };

        db.data.colaboradores.push(newColaborador);
        await db.write();

        return newColaborador;
    }

    static async update(colaboradorData, id) {
        db.read();

        const colaborador = await db.data.colaboradores.find(
            colaborador => colaborador.id === id
        );

        // Fazendo o update
        colaborador.funcao = colaboradorData.funcao;
        colaborador.horaInicioExpediente = colaboradorData.horaInicioExpediente;
        colaborador.horaFimExpediente = colaboradorData.horaFimExpediente;
        colaborador.horasTrabalhoPorDia = colaboradorData.horasTrabalhoPorDia;

        // Salvando no banco e retornando colaborador salvo
        await db.write();

        return colaborador;
    }

    static async delete(id) {
        db.read();

        const indexColaborador = await db.data.colaboradores.findIndex(
            colaborador => colaborador.id === id
        );

        db.data.colaboradores.splice(indexColaborador, 1);

        await db.write();
    }
}

export default ColaboradorRepository;