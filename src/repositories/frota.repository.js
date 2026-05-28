import Frota from '../models/frota.model.js';
import crypto from 'crypto';

class FrotaRepository {
    static async findAll() {
        const frota = await Frota.find();
        return frota;
    }

    static async findById(id) {
        const frota = await Frota.findById(id);
        return frota;
    }

    static async create(frotaData) {
        const newFrota = new Frota(frotaData);
        await newFrota.save();
        return newFrota;
    }

    static async update(frotaData, id) {
        const frota = await Frota.findByIdAndUpdate(id, frotaData, { new: true });
        return frota;
    }

    static async delete(id) {
        const frota = await Frota.findByIdAndDelete(id);
        return frota;
    }
}

export default FrotaRepository;