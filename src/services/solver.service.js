import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { httpError } from '../utils/errors.js';

const SOLVER = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../solver/solve.py');
const MAX_SIMULTANEOS = 2; // ponytail: limite por processo; fila/worker dedicado se o volume crescer
let emExecucao = 0;

// Executa o solver Python (OR-Tools) como processo filho: JSON via stdin -> JSON via stdout.
export async function executarSolver(entrada) {
    if (emExecucao >= MAX_SIMULTANEOS) {
        throw httpError(429, 'Há roteirizações em andamento. Tente novamente em instantes.');
    }
    emExecucao++;

    try {
        return await new Promise((resolve, reject) => {
            const filho = spawn(env.pythonBin, [SOLVER], { stdio: ['pipe', 'pipe', 'pipe'] });
            let saida = '';
            let erro = '';
            const prazo = setTimeout(() => {
                filho.kill('SIGKILL');
                reject(httpError(504, 'O solver excedeu o tempo limite.'));
            }, (entrada.timeLimit + 60) * 1000);

            filho.stdout.on('data', (d) => (saida += d));
            filho.stderr.on('data', (d) => (erro += d));
            filho.on('error', (e) => { clearTimeout(prazo); reject(httpError(503, `Solver indisponível: ${e.message}`)); });
            filho.on('close', (codigo) => {
                clearTimeout(prazo);
                try {
                    const resultado = JSON.parse(saida);
                    if (codigo !== 0 || resultado.status === 'ERRO') {
                        return reject(httpError(502, `Falha no solver: ${resultado.mensagem ?? erro.trim()}`));
                    }
                    resolve(resultado);
                } catch {
                    reject(httpError(502, `Resposta inválida do solver. ${erro.trim().slice(0, 300)}`));
                }
            });
            filho.stdin.end(JSON.stringify(entrada));
        });
    } finally {
        emExecucao--;
    }
}
