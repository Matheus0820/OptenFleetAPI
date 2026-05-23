import app from './app.js';

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor iniciado - Pronto para ser usado!");
    console.log(`API está rodando em: http://localhost:${PORT}/api`)
});