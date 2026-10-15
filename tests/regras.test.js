import test from 'node:test';
import assert from 'node:assert/strict';
import { extrairCoordenadas } from '../src/utils/maps.js';
import { co2Kg, co2KgPorKm, arredondar } from '../src/utils/co2.js';
import ColaboradorService from '../src/services/colaboradores.service.js';
import { ColaboradorDto } from '../src/dtos/colaboradores.dto.js';
import { UsuarioDto } from '../src/dtos/usuarios.dto.js';

test('maps: extrai coordenadas de formatos comuns do Google Maps', () => {
    const esperado = { latitude: -5.8434, longitude: -35.1994 };
    assert.deepEqual(extrairCoordenadas('https://www.google.com/maps/place/X/@-5.8434,-35.1994,17z'), esperado);
    assert.deepEqual(extrairCoordenadas('https://www.google.com/maps/place/X/data=!3d-5.8434!4d-35.1994'), esperado);
    assert.deepEqual(extrairCoordenadas('https://maps.google.com/?q=-5.8434,-35.1994'), esperado);
    assert.equal(extrairCoordenadas('https://maps.app.goo.gl/abc123'), null);
    assert.equal(extrairCoordenadas('https://x.com/@999,999'), null);
});

test('co2: 2,3 kg por litro, igual ao demo (2,3 / consumo por km)', () => {
    assert.equal(co2Kg(100, 10), 23);
    assert.equal(arredondar(co2KgPorKm(10), 3), 0.23);
    assert.equal(co2Kg(50, 0), 0);
});

test('colaborador: jornada por função e fim do expediente', () => {
    assert.deepEqual(ColaboradorService.calcularDados({ funcao: 'Técnico', horaInicioExpediente: 8 }),
        { horasTrabalhoPorDia: 8, horaFimExpediente: 16 });
    assert.deepEqual(ColaboradorService.calcularDados({ funcao: 'Estagiário', horaInicioExpediente: 8 }),
        { horasTrabalhoPorDia: 6, horaFimExpediente: 14 });
    // 24h exato é permitido; passar da meia-noite é rejeitado (antes virava módulo 24 silenciosamente).
    assert.equal(ColaboradorService.calcularDados({ funcao: 'Ajudante', horaInicioExpediente: 16 }).horaFimExpediente, 24);
    assert.throws(() => ColaboradorService.calcularDados({ funcao: 'Ajudante', horaInicioExpediente: 17 }), { statusCode: 422 });
});

test('dtos: nunca expõem senha; colaborador traz nome do usuário populado e carga semanal', () => {
    const u = new UsuarioDto({ id: '1', nome: 'A', email: 'a@a.com', nivelAcesso: 'Gestor', senha: 'hash' });
    assert.equal('senha' in u, false);

    const c = new ColaboradorDto({
        id: 'c1', user_id: { _id: 'u1', nome: 'Carlos', email: 'c@c.com' },
        funcao: 'Técnico', horaInicioExpediente: 8, horaFimExpediente: 16, horasTrabalhoPorDia: 8,
    });
    assert.equal(c.nome, 'Carlos');
    assert.equal(c.user_id, 'u1');
    assert.equal(c.cargaSemanalHoras, 40);
});
