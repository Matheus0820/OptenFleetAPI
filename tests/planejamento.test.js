import test from 'node:test';
import assert from 'node:assert/strict';
import { executarSolver } from '../src/services/solver.service.js';
import { montarEntrada, interpretarResultado, diasUteis, turnoDaEquipe, hhmm } from '../src/services/planejamento.js';

const deposito = { nome: 'Depósito', latitude: -5.843444, longitude: -35.199407 };
const cliente = (id, lat, lng, extra = {}) => ({
    id, nome: `Cliente ${id}`, tipoServico: 'Manutenção', urlMaps: 'https://maps.google.com', latitude: lat, longitude: lng,
    demanda: 1, tempoServicoMin: 60, janelaInicio: 8, janelaFim: 17, ...extra,
});
const veiculo = (id, cap, extra = {}) => ({
    id, placa: `AAA${id}A00`, modelo: 'Hilux', capacidadeCarga: cap, capacidadeMaximaTanque: 80, quilometroPorLitro: 10, ...extra,
});

test('dias úteis pulam fim de semana', () => {
    const d = diasUteis(new Date('2026-10-16T12:00:00Z'), 3); // sexta
    assert.deepEqual(d.map((x) => x.toISOString().slice(0, 10)), ['2026-10-16', '2026-10-19', '2026-10-20']);
});

test('turno da equipe é a interseção dos expedientes', () => {
    assert.deepEqual(turnoDaEquipe([{ horaInicioExpediente: 8, horaFimExpediente: 16 }, { horaInicioExpediente: 9, horaFimExpediente: 15 }]), { inicioH: 9, fimH: 15 });
    assert.deepEqual(turnoDaEquipe([]), { inicioH: 8, fimH: 17 });
    assert.equal(hhmm(545), '09:05');
});

test('solver real: respeita capacidade, janela e autonomia; reporta não atendidos', async () => {
    const clientes = [
        cliente('1', -5.8415, -35.2010),
        cliente('2', -5.8369, -35.2117),
        cliente('3', -5.8477, -35.1948, { demanda: 2 }),
        cliente('longe', -5.0, -36.5),                                   // inalcançável no turno
        cliente('tarde', -5.8450, -35.2000, { janelaInicio: 23, janelaFim: 24 }), // fora do turno 8–17
    ];
    const veiculos = [veiculo('v1', 3)];
    const entrada = montarEntrada({ deposito, clientes, veiculos, horizonte: 'Semanal', turno: { inicioH: 8, fimH: 17 }, osrmUrl: '', timeLimit: 3 });
    assert.equal(entrada.dias, 5);

    const resultado = await executarSolver(entrada);
    assert.equal(resultado.status, 'OK');
    assert.equal(resultado.fonteMatriz, 'haversine');

    const plano = interpretarResultado({ resultado, deposito, clientes, veiculos, datas: diasUteis(new Date('2026-10-19T12:00:00Z'), 5) });

    // Demanda total 4 > capacidade 3 => precisa de 2 dias.
    assert.ok(plano.dias.length >= 2);
    for (const d of plano.dias) {
        const demanda = d.paradas.reduce((t, p) => t + clientes.find((c) => c.id === p.cliente).demanda, 0);
        assert.ok(demanda <= 3, `capacidade excedida no dia ${d.dia}`);
        assert.ok(d.paradas.every((p) => p.chegada >= '08:00' && p.saida <= '17:00'));
        assert.ok(d.mapsUrl.startsWith('https://www.google.com/maps/dir/'));
        assert.ok(d.co2Kg > 0 && d.litros > 0);
    }
    assert.equal(plano.resumo.atendidos, 3);
    assert.deepEqual(plano.naoAtendidos.map((n) => n.cliente).sort(), ['longe', 'tarde']);
    assert.ok(plano.resumo.reducaoCo2Kg >= 0);
});

test('solver real: autonomia curta limita a distância por dia', async () => {
    const clientes = [cliente('a', -5.8415, -35.2010), cliente('b', -5.8369, -35.2117)];
    const veiculos = [veiculo('v1', 10, { capacidadeMaximaTanque: 0.5, quilometroPorLitro: 5 })]; // 2,5 km de alcance
    const entrada = montarEntrada({ deposito, clientes, veiculos, horizonte: 'Diário', turno: { inicioH: 8, fimH: 17 }, osrmUrl: '', timeLimit: 3 });
    const resultado = await executarSolver(entrada);
    const plano = interpretarResultado({ resultado, deposito, clientes, veiculos, datas: diasUteis(new Date('2026-10-19T12:00:00Z'), 1) });
    assert.ok(plano.dias.every((d) => d.distanciaKm <= 2.5));
});

test('solver real: antecipa atendimentos (usa os primeiros dias do horizonte)', async () => {
    const clientes = [cliente('a', -5.8415, -35.2010), cliente('b', -5.8369, -35.2117)];
    const veiculos = [veiculo('v1', 10), veiculo('v2', 10)];
    const entrada = montarEntrada({ deposito, clientes, veiculos, horizonte: 'Semanal', turno: { inicioH: 8, fimH: 17 }, osrmUrl: '', timeLimit: 3 });
    const resultado = await executarSolver(entrada);
    assert.ok(resultado.rotas.length > 0 && resultado.rotas.every((r) => r.dia === 1), `dias usados: ${resultado.rotas.map((r) => r.dia)}`);
});

test('solver real: respeita o prazo do cliente (prazoDias)', async () => {
    const clientes = [cliente('a', -5.8415, -35.2010, { prazoDias: 2 })];
    const veiculos = [veiculo('v1', 10)];
    const entrada = montarEntrada({ deposito, clientes, veiculos, horizonte: 'Semanal', turno: { inicioH: 8, fimH: 17 }, osrmUrl: '', timeLimit: 3 });
    assert.equal(entrada.clientes[0].prazoDia, 2);
    const resultado = await executarSolver(entrada);
    assert.ok(resultado.rotas.length === 1 && resultado.rotas[0].dia <= 2);
});
