import FrotaRepository from '../repositories/frota.repository.js';
import { FrotaDto } from '../dtos/frota.dto.js';
import { naoEncontrado } from '../utils/errors.js';

const CAMPOS = ['marca', 'modelo', 'categoria', 'anoFabricacao', 'placa', 'capacidadeCarga', 'capacidadeMaximaTanque', 'quilometroPorLitro'];
const apenasCampos = (dados) => Object.fromEntries(CAMPOS.filter((c) => dados[c] !== undefined).map((c) => [c, dados[c]]));

class FrotaService {
    static async findAll() {
        return (await FrotaRepository.findAll()).map((v) => new FrotaDto(v));
    }

    static async findById(id) {
        const veiculo = await FrotaRepository.findById(id);
        if (!veiculo) throw naoEncontrado('Veículo');
        return new FrotaDto(veiculo);
    }

    static async create(dados) {
        return new FrotaDto(await FrotaRepository.create(apenasCampos(dados)));
    }

    // PUT e PATCH compartilham a lógica; a diferença (campos obrigatórios) está no validator.
    static async atualizar(dados, id) {
        if (!(await FrotaRepository.findById(id))) throw naoEncontrado('Veículo');
        return new FrotaDto(await FrotaRepository.update(apenasCampos(dados), id));
    }

    static put(dados, id) { return this.atualizar(dados, id); }
    static patch(dados, id) { return this.atualizar(dados, id); }

    static async delete(id) {
        const salvo = await FrotaRepository.findById(id);
        if (!salvo) throw naoEncontrado('Veículo');
        await FrotaRepository.delete(id);
        return new FrotaDto(salvo);
    }
}

export default FrotaService;
