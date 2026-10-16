import app from './app.js';
import connectDB from './config/database.js';
import { env, validateEnv } from './config/env.js';

try {
    validateEnv();
    await connectDB();
    app.listen(env.port, () => {
        console.log('Servidor iniciado - Pronto para ser usado!');
        console.log(`API: http://localhost:${env.port}/api  |  Docs: http://localhost:${env.port}/api-docs`);
    });
} catch (error) {
    console.error('Falha ao iniciar:', error.message);
    process.exit(1);
}
