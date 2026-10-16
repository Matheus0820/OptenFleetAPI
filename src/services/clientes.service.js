import ClienteRepository from '../repositories/clientes.repository.js';
import { ClienteDto } from '../dtos/clientes.dto.js';
import { TEMPO_SERVICO_PADRAO_MIN } from '../models/clientes.model.js';
import { extrairCoordenadas, coordenadaValida } from '../utils/maps.js';
import { httpError, naoEncontrado } from '../utils/errors.js';

// Coordenadas: as informadas manualmente têm prioridade; senão saem da urlMaps.
const resolverCoordenadas = ({ latitude, longitude, urlMaps }) => {
    if (latitude !== undefined && longitude !== undefined) {
        if (!coordenadaValida(Number(latitude), Number(longitude))) throw httpError(422, 'Latitude/longitude inválidas.');
        return { latitude: Number(latitude), longitude: Number(longitude) };
    }
    const extraidas = extrairCoordenadas(urlMaps);
    if (!extraidas) {
        throw httpError(422, 'Não foi possível obter as coordenadas da URL do Maps (links curtos não trazem coordenadas). Use o link completo ou informe latitude e longitude.');
    }
    return extraidas;
};

const janelaConsistente = ({ janelaInicio, janelaFim }) => {
    if (janelaInicio >= janelaFim) throw httpError(422, 'janelaInicio deve ser menor que janelaFim.');
};

class ClienteService {
    static async findAll() {
        return (await ClienteRepository.findAll()).map((c) => new ClienteDto(c));
    }

    static async findById(id) {
        const cliente = await ClienteRepository.findById(id);
        if (!cliente) throw naoEncontrado('Cliente');
        return new ClienteDto(cliente);
    }

    static async create(dados) {
        const completo = {
            ...dados,
            ...resolverCoordenadas(dados),
            tempoServicoMin: dados.tempoServicoMin ?? TEMPO_SERVICO_PADRAO_MIN[dados.tipoServico],
        };
        janelaConsistente({ janelaInicio: completo.janelaInicio ?? 8, janelaFim: completo.janelaFim ?? 17 });
        return new ClienteDto(await ClienteRepository.create(completo));
    }

    static async put(dados, id) {
        const salvo = await ClienteRepository.findById(id);
        if (!salvo) throw naoEncontrado('Cliente');

        // PUT substitui: campos opcionais não enviados voltam ao padrão.
        const completo = {
            nome: dados.nome,
            tipoServico: dados.tipoServico,
            urlMaps: dados.urlMaps,
            ...resolverCoordenadas(dados),
            demanda: dados.demanda ?? 1,
            tempoServicoMin: dados.tempoServicoMin ?? TEMPO_SERVICO_PADRAO_MIN[dados.tipoServico],
            prazoDias: dados.prazoDias ?? null,
            janelaInicio: dados.janelaInicio ?? 8,
            janelaFim: dados.janelaFim ?? 17,
        };
        janelaConsistente(completo);
        return new ClienteDto(await ClienteRepository.update(completo, id));
    }

    static async patch(dados, id) {
        const salvo = await ClienteRepository.findById(id);
        if (!salvo) throw naoEncontrado('Cliente');

        const update = { ...dados };
        // Trocou o link (ou informou coordenadas): recalcula as coordenadas.
        if (dados.urlMaps !== undefined || dados.latitude !== undefined || dados.longitude !== undefined) {
            Object.assign(update, resolverCoordenadas({ ...dados, urlMaps: dados.urlMaps ?? salvo.urlMaps }));
        }
        janelaConsistente({
            janelaInicio: dados.janelaInicio ?? salvo.janelaInicio,
            janelaFim: dados.janelaFim ?? salvo.janelaFim,
        });
        return new ClienteDto(await ClienteRepository.update(update, id));
    }

    static async delete(id) {
        const salvo = await ClienteRepository.findById(id);
        if (!salvo) throw naoEncontrado('Cliente');
        await ClienteRepository.delete(id);
        return new ClienteDto(salvo);
    }
}

export default ClienteService;
