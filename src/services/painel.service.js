import Rota from '../models/rotas.model.js';
import Frota from '../models/frota.model.js';
import Cliente from '../models/clientes.model.js';
import Colaborador from '../models/colaboradores.model.js';
import { arredondar } from '../utils/co2.js';

const inicioDoMes = () => {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
};

const CAMPOS = ['distanciaKm', 'tempoMin', 'litros', 'co2Kg', 'reducaoCo2Kg'];

// Soma os indicadores de várias rotas.
// ponytail: soma em JS (uma rota por execução de planejamento => volume baixo);
// migrar para $group se houver dezenas de milhares de rotas.
const somar = (rotas) =>
    Object.fromEntries(CAMPOS.map((c) => [c, rotas.reduce((t, r) => t + (r.resumo?.[c] ?? 0), 0)]));

const resumos = (filtro = {}) => Rota.find(filtro).select('createdAt resumo').lean();

class PainelService {
    // Números do dashboard (visão geral).
    static async dashboard() {
        const [rotas, colaboradores, frota, clientes, doMes] = await Promise.all([
            Rota.countDocuments(),
            Colaborador.countDocuments(),
            Frota.countDocuments(),
            Cliente.countDocuments(),
            resumos({ createdAt: { $gte: inicioDoMes() } }),
        ]);
        const mes = somar(doMes);
        return {
            rotas, colaboradores, frota, clientes,
            reducaoMensalCo2Kg: arredondar(mes.reducaoCo2Kg, 1),
            emissaoMensalCo2Kg: arredondar(mes.co2Kg, 1),
        };
    }

    // Relatório de emissões agrupado por mês de criação das rotas (mais recente primeiro).
    static async emissoes() {
        const todas = await resumos();
        const porMes = new Map();
        for (const r of todas) {
            const periodo = r.createdAt.toISOString().slice(0, 7);
            porMes.set(periodo, [...(porMes.get(periodo) ?? []), r]);
        }
        const meses = [...porMes.entries()]
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([periodo, rs]) => {
                const s = somar(rs);
                return {
                    periodo, rotas: rs.length,
                    distanciaKm: arredondar(s.distanciaKm), litros: arredondar(s.litros),
                    co2Kg: arredondar(s.co2Kg), reducaoCo2Kg: arredondar(s.reducaoCo2Kg),
                };
            });
        const total = (k) => arredondar(meses.reduce((t, m) => t + m[k], 0));
        return { meses, totais: { co2Kg: total('co2Kg'), reducaoCo2Kg: total('reducaoCo2Kg'), distanciaKm: total('distanciaKm') } };
    }

    // Relatório de equipe: carga contratada x horas em rota planejadas no mês.
    static async equipe() {
        const [colaboradores, doMes] = await Promise.all([
            Colaborador.find().populate('user_id', 'nome'),
            resumos({ createdAt: { $gte: inicioDoMes() } }),
        ]);

        const porFuncao = {};
        for (const c of colaboradores) {
            const f = (porFuncao[c.funcao] ??= { colaboradores: 0, horasSemanais: 0 });
            f.colaboradores++;
            f.horasSemanais += c.horasTrabalhoPorDia * 5;
        }
        const pad = (h) => String(h).padStart(2, '0');
        return {
            colaboradores: colaboradores.length,
            horasSemanaisContratadas: Object.values(porFuncao).reduce((t, f) => t + f.horasSemanais, 0),
            horasEmRotaNoMes: arredondar(somar(doMes).tempoMin / 60, 1),
            porFuncao,
            detalhe: colaboradores.map((c) => ({
                nome: c.user_id?.nome ?? '—', funcao: c.funcao,
                jornada: `${pad(c.horaInicioExpediente)}:00 - ${pad(c.horaFimExpediente)}:00`,
                cargaSemanalHoras: c.horasTrabalhoPorDia * 5,
            })),
        };
    }
}

export default PainelService;
