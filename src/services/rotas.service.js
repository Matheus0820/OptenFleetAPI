import RotaRepository from '../repositories/rotas.repository.js';
import ClienteRepository from '../repositories/clientes.repository.js';
import FrotaRepository from '../repositories/frota.repository.js';
import ColaboradorRepository from '../repositories/colaboradores.repository.js';
import { executarSolver } from './solver.service.js';
import { DIAS_POR_HORIZONTE, diasUteis, turnoDaEquipe, montarEntrada, interpretarResultado } from './planejamento.js';
import { env } from '../config/env.js';
import { httpError, naoEncontrado } from '../utils/errors.js';

const paraDto = (rota) => {
    const o = rota.toObject();
    o.id = rota.id;
    delete o._id;
    delete o.__v;
    return o;
};

// Busca todos (ou só os IDs informados) e acusa IDs inexistentes.
const carregar = async (repo, ids, rotulo) => {
    const itens = await repo.findAll(ids ? { _id: { $in: ids } } : {});
    if (ids) {
        const achados = new Set(itens.map((i) => i.id));
        const faltando = ids.filter((id) => !achados.has(String(id)));
        if (faltando.length) throw httpError(404, `${rotulo} não encontrado(s): ${faltando.join(', ')}`);
    }
    return itens;
};

class RotaService {
    static async findAll() {
        return (await RotaRepository.findResumos()).map(paraDto);
    }

    static async findById(id) {
        const rota = await RotaRepository.findById(id);
        if (!rota) throw naoEncontrado('Rota');
        return paraDto(rota);
    }

    static async delete(id) {
        const rota = await RotaRepository.delete(id);
        if (!rota) throw naoEncontrado('Rota');
        return paraDto(rota);
    }

    // Gera a roteirização (VRPTW + CVRP) para o horizonte e persiste o resultado.
    static async gerar(dados, usuario) {
        const clientes = await carregar(ClienteRepository, dados.clienteIds, 'Cliente');
        const veiculos = await carregar(FrotaRepository, dados.veiculoIds, 'Veículo');
        const colaboradores = await carregar(ColaboradorRepository, dados.colaboradorIds, 'Colaborador');

        if (!clientes.length) throw httpError(422, 'Cadastre ao menos um cliente para roteirizar.');
        if (!veiculos.length) throw httpError(422, 'Cadastre ao menos um veículo para roteirizar.');

        const turno = turnoDaEquipe(colaboradores);
        if (turno.inicioH >= turno.fimH) {
            throw httpError(422, 'Os expedientes dos colaboradores não possuem horário em comum.');
        }

        const dataInicio = dados.dataInicio ? new Date(dados.dataInicio) : new Date();
        const datas = diasUteis(dataInicio, DIAS_POR_HORIZONTE[dados.horizonte]);
        const d = env.deposito;
        const deposito = { nome: d.nome, latitude: d.lat, longitude: d.lng };

        const resultado = await executarSolver(montarEntrada({
            deposito, clientes, veiculos, horizonte: dados.horizonte, turno,
            osrmUrl: env.osrmUrl, timeLimit: env.solverTimeLimit,
        }));
        if (resultado.status !== 'OK') throw httpError(422, 'Não foi encontrada solução viável para os dados informados.');

        const planejado = interpretarResultado({ resultado, deposito, clientes, veiculos, datas });
        const salva = await RotaRepository.create({
            nome: dados.nome,
            horizonte: dados.horizonte,
            dataInicio: datas[0],
            deposito,
            fonteMatriz: resultado.fonteMatriz,
            criadaPor: usuario?.id,
            ...planejado,
        });
        return paraDto(salva);
    }
}

export default RotaService;
