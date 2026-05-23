import db from '../config/database.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class FrotaRepository {
    static async findAll() {
        db.read();

        const allFrota = db.data.frota;
        return allFrota;
    }

    static async findById(id) {
        db.read();

        const frota = db.data.frota.find(frota => frota.id === id);
        return frota;
    }

    static async create(frotaData) {
        global.crypto = crypto;
        db.read();

        const newFrota = {
            id: uuidv4(),
            marca: frotaData.marca,
            anoFabricacao: frotaData.anoFabricacao,
            placa: frotaData.placa,
            capacidadeMaximaTanque: frotaData.capacidadeMaximaTanque,
            quilometroPorLitro: frotaData.quilometroPorLitro
        };

        db.data.frota.push(newFrota);
        await db.write();

        return newFrota;
    }

    static async update(frotaData, id) {
        db.read();

        const frota = db.data.frota.find(frota => frota.id === id);

        // Fazendo o update
        frota.marca = frotaData.marca;
        frota.anoFabricacao = frotaData.anoFabricacao;
        frota.placa = frotaData.placa;
        frota.capacidadeMaximaTanque = frotaData.capacidadeMaximaTanque;
        frota.quilometroPorLitro = frotaData.quilometroPorLitro;

        await db.write();

        return frota;
    }

    static async delete(id) {
        db.read();

        const indexFrota = db.data.frota.findIndex(frota => frota.id === id);

        db.data.frota.splice(indexFrota, 1);
        await db.write();
    }
}

export default FrotaRepository;