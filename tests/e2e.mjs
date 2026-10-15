// Teste de ponta a ponta contra uma API + MongoDB reais (banco limpo).
// Uso: BASE_URL=http://localhost:3000 node tests/e2e.mjs   (ou: npm run test:e2e)
import assert from 'node:assert/strict';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const sufixo = Date.now();
let passos = 0;

const api = async (metodo, caminho, corpo, token) => {
    const r = await fetch(BASE + caminho, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: corpo && JSON.stringify(corpo),
    });
    const texto = await r.text();
    return { status: r.status, corpo: texto ? JSON.parse(texto) : null };
};
const passo = async (nome, fn) => { await fn(); passos++; console.log(`  ✔ ${nome}`); };

console.log(`E2E em ${BASE}`);

let gestor, colab, tg, tc, veic1, veic2, c1, c2, colaboradorId, rotaId;

await passo('primeiro usuário vira Gestor (bootstrap) e a resposta não expõe senha', async () => {
    const r = await api('POST', '/api/usuarios', { nome: 'Gestora', email: `g${sufixo}@opten.com`, senha: 'senha123', nivelAcesso: 'Colaborador' });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.nivelAcesso, 'Gestor');
    assert.equal('senha' in r.corpo, false);
    gestor = r.corpo;
});

await passo('cadastro público nunca cria Gestor (escalada de privilégio bloqueada)', async () => {
    const r = await api('POST', '/api/usuarios', { nome: 'Carlos', email: `c${sufixo}@opten.com`, senha: 'senha123', nivelAcesso: 'Gestor' });
    assert.equal(r.status, 201);
    assert.equal(r.corpo.nivelAcesso, 'Colaborador');
    colab = r.corpo;
});

await passo('e-mail duplicado → 409 (case-insensitive)', async () => {
    const r = await api('POST', '/api/usuarios', { nome: 'Dup', email: `C${sufixo}@OPTEN.com`, senha: 'senha123' });
    assert.equal(r.status, 409);
});

await passo('login: credenciais erradas 401; corretas devolvem token + usuário', async () => {
    assert.equal((await api('POST', '/api/login', { email: `g${sufixo}@opten.com`, senha: 'errada1' })).status, 401);
    assert.equal((await api('POST', '/api/login', { email: 'naoexiste@x.com', senha: 'senha123' })).status, 401);
    const g = await api('POST', '/api/login', { email: `g${sufixo}@opten.com`, senha: 'senha123' });
    assert.equal(g.status, 200);
    tg = g.corpo.token_user;
    assert.equal(g.corpo.usuario.nivelAcesso, 'Gestor');
    tc = (await api('POST', '/api/login', { email: `c${sufixo}@opten.com`, senha: 'senha123' })).corpo.token_user;
});

await passo('listagem de usuários não vaza hash de senha', async () => {
    const r = await api('GET', '/api/usuarios', null, tg);
    assert.equal(r.status, 200);
    assert.ok(r.corpo.every((u) => !('senha' in u)));
});

await passo('frota: cria, placa duplicada 409, PATCH parcial funciona', async () => {
    const base = { marca: 'Toyota', modelo: 'Hilux', categoria: 'Insumos', anoFabricacao: 2022, capacidadeCarga: 3, capacidadeMaximaTanque: 80, quilometroPorLitro: 10 };
    const a = await api('POST', '/api/frota', { ...base, placa: 'abc1d23' }, tg);
    assert.equal(a.status, 201);
    assert.equal(a.corpo.placa, 'ABC1D23');
    assert.equal(a.corpo.emissaoCo2KgPorKm, 0.23);
    assert.equal(a.corpo.autonomiaKm, 800);
    veic1 = a.corpo;
    assert.equal((await api('POST', '/api/frota', { ...base, placa: 'ABC1D23' }, tg)).status, 409);
    const b = await api('POST', '/api/frota', { ...base, marca: 'Renault', modelo: 'Master', categoria: 'Pessoas', capacidadeCarga: 15, quilometroPorLitro: 12, placa: 'EFG2H34' }, tg);
    assert.equal(b.status, 201);
    veic2 = b.corpo;
    const p = await api('PATCH', `/api/frota/${veic1.id}`, { quilometroPorLitro: 11 }, tg);
    assert.equal(p.status, 200);
    assert.equal(p.corpo.quilometroPorLitro, 11);
    assert.equal(p.corpo.marca, 'Toyota');
});

await passo('clientes: coordenadas da URL, link curto → 422, lat/long manual aceita, padrões por serviço', async () => {
    const a = await api('POST', '/api/clientes', { nome: 'Fazenda Solar', tipoServico: 'Instalação', urlMaps: 'https://www.google.com/maps/place/X/@-5.8415,-35.2010,17z' }, tg);
    assert.equal(a.status, 201);
    assert.equal(a.corpo.latitude, -5.8415);
    assert.equal(a.corpo.tempoServicoMin, 120);
    c1 = a.corpo;
    const curto = await api('POST', '/api/clientes', { nome: 'Curto', tipoServico: 'Manutenção', urlMaps: 'https://maps.app.goo.gl/abc' }, tg);
    assert.equal(curto.status, 422);
    const b = await api('POST', '/api/clientes', { nome: 'Usina Norte', tipoServico: 'Manutenção', urlMaps: 'https://maps.app.goo.gl/abc', latitude: -5.8369, longitude: -35.2117, demanda: 2 }, tg);
    assert.equal(b.status, 201);
    assert.equal(b.corpo.tempoServicoMin, 60);
    c2 = b.corpo;
    assert.equal((await api('POST', '/api/clientes', { nome: 'Jan', tipoServico: 'Manutenção', urlMaps: 'https://x.com/@-5.8,-35.2', janelaInicio: 17, janelaFim: 9 }, tg)).status, 400);
});

await passo('colaborador: jornada calculada, nome populado, duplicidade 409, meia-noite 422', async () => {
    const r = await api('POST', '/api/colaboradores', { user_id: colab.id, funcao: 'Estagiário', horaInicioExpediente: 8 }, tg);
    assert.equal(r.status, 201);
    assert.equal(r.corpo.horasTrabalhoPorDia, 6);
    assert.equal(r.corpo.horaFimExpediente, 14);
    assert.equal(r.corpo.nome, 'Carlos');
    assert.equal(r.corpo.cargaSemanalHoras, 30);
    colaboradorId = r.corpo.id;
    assert.equal((await api('POST', '/api/colaboradores', { user_id: colab.id, funcao: 'Técnico', horaInicioExpediente: 8 }, tg)).status, 409);
    assert.equal((await api('PATCH', `/api/colaboradores/${colaboradorId}`, { horaInicioExpediente: 20 }, tg)).status, 422);
    assert.equal((await api('PATCH', `/api/colaboradores/${colaboradorId}`, { funcao: 'Técnico' }, tg)).corpo.horaFimExpediente, 16);
    assert.equal((await api('POST', '/api/colaboradores', { user_id: gestor.id, funcao: 'Técnico', horaInicioExpediente: 8 }, tg)).status, 403);
});

await passo('rota semanal: gera, respeita capacidade, calcula CO₂ e link do Maps', async () => {
    const r = await api('POST', '/api/rotas', { nome: 'Rota Solar A1', horizonte: 'Semanal', dataInicio: '2026-10-19' }, tg);
    assert.equal(r.status, 201, JSON.stringify(r.corpo));
    rotaId = r.corpo.id;
    const { resumo, dias } = r.corpo;
    assert.equal(resumo.destinos, 2);
    assert.equal(resumo.atendidos, 2);
    assert.ok(resumo.distanciaKm > 0 && resumo.co2Kg > 0);
    assert.ok(dias.length >= 1);
    for (const d of dias) {
        assert.ok(d.mapsUrl.startsWith('https://www.google.com/maps/dir/'));
        assert.ok(d.paradas.every((p) => p.chegada >= '09:00' || p.chegada >= '08:00'));
    }
    // turno da equipe (Técnico às 8h → 8–16h): nenhuma saída depois das 16:00
    assert.ok(dias.every((d) => d.paradas.every((p) => p.saida <= '16:00')));
});

await passo('listar/detalhar/permissões de rotas', async () => {
    const lista = await api('GET', '/api/rotas', null, tc);
    assert.equal(lista.status, 200);
    assert.ok(!('dias' in lista.corpo[0]));
    assert.ok((await api('GET', `/api/rotas/${rotaId}`, null, tc)).corpo.dias.length >= 1);
    assert.equal((await api('POST', '/api/rotas', { nome: 'x', horizonte: 'Diário' }, tc)).status, 403);
    assert.equal((await api('POST', '/api/clientes', { nome: 'Z', tipoServico: 'Instalação', urlMaps: 'https://x.com/@-5.8,-35.2' }, tc)).status, 403);
    assert.equal((await api('GET', '/api/frota', null, tc)).status, 403);
    assert.equal((await api('GET', '/api/clientes', null, tc)).status, 200);
});

await passo('rota sem veículo/cliente → 422; ID inexistente → 404; ID malformado → 400', async () => {
    assert.equal((await api('GET', '/api/rotas/64b000000000000000000001', null, tg)).status, 404);
    assert.equal((await api('GET', '/api/rotas/xyz', null, tg)).status, 400);
    assert.equal((await api('POST', '/api/rotas', { nome: 'Rota X', horizonte: 'Diário', clienteIds: ['64b000000000000000000001'] }, tg)).status, 404);
});

await passo('dashboard e relatórios', async () => {
    const d = await api('GET', '/api/dashboard', null, tc);
    assert.equal(d.status, 200);
    assert.deepEqual([d.corpo.rotas, d.corpo.frota, d.corpo.clientes, d.corpo.colaboradores], [1, 2, 2, 1]);
    assert.ok(d.corpo.emissaoMensalCo2Kg > 0);
    const em = await api('GET', '/api/relatorios/emissoes', null, tg);
    assert.equal(em.status, 200);
    assert.equal(em.corpo.meses.length, 1);
    const eq = await api('GET', '/api/relatorios/equipe', null, tg);
    assert.equal(eq.corpo.horasSemanaisContratadas, 40);
    assert.equal(eq.corpo.detalhe[0].nome, 'Carlos');
    assert.equal((await api('GET', '/api/relatorios/equipe', null, tc)).status, 403);
});

await passo('último Gestor e o próprio usuário não podem ser removidos/rebaixados', async () => {
    assert.equal((await api('DELETE', `/api/usuarios/${gestor.id}`, null, tg)).status, 409);
    assert.equal((await api('PATCH', `/api/usuarios/${gestor.id}`, { nivelAcesso: 'Colaborador' }, tg)).status, 409);
});

await passo('Gestor edita usuário (PATCH parcial + troca de senha com novo login)', async () => {
    const r = await api('PATCH', `/api/usuarios/${colab.id}`, { nome: 'Carlos Oliveira', senha: 'novasenha9' }, tg);
    assert.equal(r.status, 200);
    assert.equal(r.corpo.nome, 'Carlos Oliveira');
    assert.equal(r.corpo.email, `c${sufixo}@opten.com`);
    assert.equal((await api('POST', '/api/login', { email: `c${sufixo}@opten.com`, senha: 'senha123' })).status, 401);
    assert.equal((await api('POST', '/api/login', { email: `c${sufixo}@opten.com`, senha: 'novasenha9' })).status, 200);
});

await passo('remover usuário Colaborador também remove o cadastro de colaborador (cascata)', async () => {
    assert.equal((await api('DELETE', `/api/usuarios/${colab.id}`, null, tg)).status, 200);
    assert.equal((await api('GET', `/api/colaboradores/${colaboradorId}`, null, tg)).status, 404);
});

await passo('limpeza: remove rota, clientes e frota', async () => {
    assert.equal((await api('DELETE', `/api/rotas/${rotaId}`, null, tg)).status, 200);
    for (const id of [c1.id, c2.id]) assert.equal((await api('DELETE', `/api/clientes/${id}`, null, tg)).status, 200);
    for (const id of [veic1.id, veic2.id]) assert.equal((await api('DELETE', `/api/frota/${id}`, null, tg)).status, 200);
});

console.log(`\n${passos} passos OK`);
