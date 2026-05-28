import app from './app.js';
import connectDB from './config/database.js';

const PORT = 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Servidor iniciado - Pronto para ser usado!");
        console.log(`API está rodando em: http://localhost:${PORT}/api`)
    });
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
});