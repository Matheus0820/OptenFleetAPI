import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'segredo-de-teste-0123456789';
const { default: app } = await import('../src/app.js');

const servidor = app.listen(0);
const base = `http://127.0.0.1:${servidor.address().port}`;
test.after(() => servidor.close());

const token = (nivelAcesso) => jwt.sign({ id: '64b000000000000000000001', nivelAcesso }, process.env.JWT_SECRET);
const chamar = (caminho, { metodo = 'GET', corpo, nivel } = {}) =>
    fetch(base + caminho, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', ...(nivel && { Authorization: `Bearer ${token(nivel)}` }) },
        body: corpo && JSON.stringify(corpo),
    });

test('rotas protegidas exigem token', async () => {
    for (const c of ['/api/clientes', '/api/frota', '/api/rotas', '/api/dashboard', '/api/usuarios']) {
        assert.equal((await chamar(c)).status, 401, c);
    }
    const ruim = await fetch(base + '/api/clientes', { headers: { Authorization: 'Bearer lixo' } });
    assert.equal(ruim.status, 401);
});

test('Colaborador não escreve em clientes/frota/rotas nem lê frota', async () => {
    assert.equal((await chamar('/api/clientes', { metodo: 'POST', nivel: 'Colaborador', corpo: {} })).status, 403);
    assert.equal((await chamar('/api/frota', { nivel: 'Colaborador' })).status, 403);
    assert.equal((await chamar('/api/rotas', { metodo: 'POST', nivel: 'Colaborador', corpo: {} })).status, 403);
    assert.equal((await chamar('/api/relatorios/emissoes', { nivel: 'Colaborador' })).status, 403);
});

test('validação: veículo, cliente, rota e usuário inválidos retornam 400 com detalhes', async () => {
    const veic = await chamar('/api/frota', { metodo: 'POST', nivel: 'Gestor', corpo: { marca: 'F', placa: 'x', categoria: 'Carga' } });
    assert.equal(veic.status, 400);
    const campos = (await veic.json()).erros.map((e) => e.path);
    for (const c of ['modelo', 'categoria', 'placa', 'capacidadeCarga', 'quilometroPorLitro']) assert.ok(campos.includes(c), c);

    const cli = await chamar('/api/clientes', { metodo: 'POST', nivel: 'Gestor', corpo: { nome: 'A', tipoServico: 'Outro', urlMaps: 'não é url' } });
    assert.equal(cli.status, 400);

    const rota = await chamar('/api/rotas', { metodo: 'POST', nivel: 'Gestor', corpo: { nome: 'R', horizonte: 'Anual' } });
    assert.equal(rota.status, 400);

    const user = await chamar('/api/usuarios', { metodo: 'POST', corpo: { nome: 'Ana', email: 'x', senha: 'abcdef' } });
    assert.equal(user.status, 400);
});

test('login sem corpo válido é 400 e rota /api desconhecida é 404 JSON', async () => {
    assert.equal((await chamar('/api/login', { metodo: 'POST', corpo: {} })).status, 400);
    const r = await chamar('/api/nao-existe');
    assert.equal(r.status, 404);
    assert.equal((await r.json()).message, 'Rota não encontrada.');
});

test('PATCH aceita corpo parcial: não devolve erro de campo obrigatório', async () => {
    // Sem MongoDB nos testes, o que importa é não ser barrado pela validação (erros[]).
    const r = await chamar('/api/frota/ID_INVALIDO', { metodo: 'PATCH', nivel: 'Gestor', corpo: { marca: 'Fiat' } });
    assert.equal((await r.json()).erros, undefined);
});
