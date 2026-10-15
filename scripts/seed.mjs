// Popula a API com dados de demonstração (frota, equipe, clientes e uma rota semanal).
// Uso: BASE_URL=http://localhost:3000 SEED_EMAIL=gestor@opten.com SEED_SENHA=senha123 node scripts/seed.mjs
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const EMAIL = process.env.SEED_EMAIL ?? 'gestor@opten.com';
const SENHA = process.env.SEED_SENHA ?? 'senha123';

const chamar = async (metodo, caminho, corpo, token) => {
    const r = await fetch(BASE + caminho, {
        method: metodo,
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: corpo && JSON.stringify(corpo),
    });
    const dados = await r.json().catch(() => null);
    if (!r.ok) throw new Error(`${metodo} ${caminho} → ${r.status} ${JSON.stringify(dados)}`);
    return dados;
};

// O primeiro usuário do sistema vira Gestor; se já existir, apenas faz login.
await chamar('POST', '/api/usuarios', { nome: 'Gestor Opt.en', email: EMAIL, senha: SENHA }).catch(() => {});
const token = (await chamar('POST', '/api/login', { email: EMAIL, senha: SENHA })).token_user;
const post = (c, b) => chamar('POST', c, b, token);

for (const v of [
    { marca: 'Toyota', modelo: 'Hilux', categoria: 'Insumos', anoFabricacao: 2023, placa: 'OPT2A25', capacidadeCarga: 12, capacidadeMaximaTanque: 80, quilometroPorLitro: 10 },
    { marca: 'Renault', modelo: 'Master', categoria: 'Pessoas', anoFabricacao: 2022, placa: 'ENT1A10', capacidadeCarga: 15, capacidadeMaximaTanque: 80, quilometroPorLitro: 12 },
]) await post('/api/frota', v).catch((e) => console.log('·', e.message.slice(0, 90)));

for (const [nome, funcao, inicio] of [['Carlos Oliveira', 'Técnico', 8], ['Ana Costa', 'Ajudante', 9], ['Júlio Mota', 'Estagiário', 8]]) {
    try {
        const u = await post('/api/usuarios', { nome, email: `${nome.split(' ')[0].toLowerCase()}@opten.com`, senha: 'senha123', nivelAcesso: 'Colaborador' });
        await post('/api/colaboradores', { user_id: u.id, funcao, horaInicioExpediente: inicio });
    } catch (e) { console.log('·', e.message.slice(0, 90)); }
}

// Clientes na região do depósito (coordenadas do notebook do projeto, Natal/RN).
const clientes = [
    ['Residência Silva', 'Instalação', -5.841485, -35.201049], ['Fazenda Solar Norte', 'Manutenção', -5.836854, -35.211671],
    ['Comércio Bom Preço', 'Instalação', -5.834968, -35.203837], ['Clínica Vida', 'Manutenção', -5.847698, -35.194750],
    ['Escola Municipal', 'Instalação', -5.842788, -35.206289], ['Padaria Central', 'Manutenção', -5.835460, -35.201172],
    ['Hotel Praia Azul', 'Instalação', -5.844917, -35.202744], ['Galpão Logística', 'Manutenção', -5.845226, -35.196394],
];
for (const [nome, tipoServico, latitude, longitude] of clientes) {
    await post('/api/clientes', { nome, tipoServico, urlMaps: `https://www.google.com/maps/@${latitude},${longitude},17z` }).catch((e) => console.log('·', e.message.slice(0, 90)));
}

const rota = await post('/api/rotas', { nome: 'Rota Solar A1', horizonte: 'Semanal' });
console.log(`Seed concluído. Rota "${rota.nome}": ${rota.resumo.atendidos}/${rota.resumo.destinos} clientes, ${rota.resumo.distanciaKm} km, ${rota.resumo.co2Kg} kg CO₂.`);
console.log(`Login: ${EMAIL} / ${SENHA}`);
