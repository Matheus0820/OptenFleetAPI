import 'dotenv/config';

// Configurações lidas em tempo de uso (getters) para facilitar testes.
export const env = {
    get port() { return Number(process.env.PORT) || 3000; },
    get jwtSecret() { return process.env.JWT_SECRET; },
    get mongoUrl() { return process.env.MONGODB_URL; },
    get pythonBin() { return process.env.PYTHON_BIN || 'python3'; },
    get solverTimeLimit() { return Number(process.env.SOLVER_TIME_LIMIT) || 10; },
    // Servidor OSRM para matriz de distância/tempo. Vazio = usa estimativa haversine.
    get osrmUrl() { return process.env.OSRM_URL ?? 'https://router.project-osrm.org'; },
    get deposito() {
        return {
            nome: process.env.DEPOT_NOME || 'Depósito Opt.en',
            lat: Number(process.env.DEPOT_LAT ?? -5.843444),
            lng: Number(process.env.DEPOT_LNG ?? -35.199407),
        };
    },
};

export function validateEnv() {
    const faltando = ['JWT_SECRET', 'MONGODB_URL'].filter((k) => !process.env[k]);
    if (faltando.length) {
        throw new Error(`Variáveis de ambiente obrigatórias ausentes: ${faltando.join(', ')}`);
    }
    if (process.env.JWT_SECRET.length < 16) {
        throw new Error('JWT_SECRET deve ter pelo menos 16 caracteres.');
    }
}
