import Colaborador from '../models/colaboradores.model.js';
import crypto from 'crypto';

class ColaboradorRepository {
    static async findAll() {
        const colaboradores = await Colaborador.find();
        return colaboradores;
    }

    static async findById(id) {
        const colaborador = await Colaborador.findById(id);
        return colaborador;
    }

    static async create(colaboradorData) {
        const newColaborador = new Colaborador(colaboradorData);
        await newColaborador.save();
        return newColaborador;
    }

    static async update(colaboradorData, id) {
        const colaborador = await Colaborador.findByIdAndUpdate(id, colaboradorData, { new: true });
        return colaborador;
    }

    static async delete(id) {
        const colaborador = await Colaborador.findByIdAndDelete(id);
        return colaborador;
    }
}

export default ColaboradorRepository;