import FrotaRepository from '../repositories/frota.repository.js';
import { FrotaDto } from '../dtos/frota.dto.js';

class FrotaService {

    static async findAll() {
        const frota = await FrotaRepository.findAll();

        return frota.map(veiculo => new FrotaDto(veiculo));
    }

    static async findById(id) {
        const frota = await FrotaRepository.findById(id);

        if (!frota) {
            return new Error('Veículo com ID informado não existe.');
        }

        return new FrotaDto(frota);
    }

    static async create(frotaData) {
        const newFrotaFromDb = await FrotaRepository.create(frotaData);

        return new FrotaDto(newFrotaFromDb);
    }

    static async put(frotaData, id) {
        const frotaSalva = await FrotaRepository.findById(id);

        if (!frotaSalva) {
            return new Error('Veículo com ID informado não existe.');
        }

        const newVeiculo = {
            marca: frotaData.marca,
            anoFabricacao: frotaData.anoFabricacao,
            placa: frotaData.placa,
            capacidadeMaximaTanque: frotaData.capacidadeMaximaTanque,
            quilometroPorLitro: frotaData.quilometroPorLitro
        };

        const frotaUpdateDb = await FrotaRepository.update(newVeiculo, id);

        return new FrotaDto(frotaUpdateDb);
    }

    static async patch(frotaData, id) {
        const frotaSalva = await FrotaRepository.findById(id);

        if (!frotaSalva) {
            return new Error('Veículo com ID informado não existe.');
        }

        const dadosAtualizados = {
            marca: frotaData.marca ?? frotaSalva.marca,
            anoFabricacao: frotaData.anoFabricacao ?? frotaSalva.anoFabricacao,
            placa: frotaData.placa ?? frotaSalva.placa,
            capacidadeMaximaTanque: frotaData.capacidadeMaximaTanque ?? frotaSalva.capacidadeMaximaTanque,
            quilometroPorLitro: frotaData.quilometroPorLitro ?? frotaSalva.quilometroPorLitro
        };

        const frotaUpdateDb = await FrotaRepository.update(dadosAtualizados, id);

        return new FrotaDto(frotaUpdateDb);
    }

    static async delete(id) {
        const frotaSalva = await FrotaRepository.findById(id);

        if (!frotaSalva) {
            return new Error('Veículo com ID informado não existe.');
        }

        await FrotaRepository.delete(id);

        return new FrotaDto(frotaSalva);
    }
}

export default FrotaService;