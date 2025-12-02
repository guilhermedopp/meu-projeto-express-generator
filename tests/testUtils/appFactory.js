const express = require('express');
const path = require('path');
const contatoRoutes = require('../../routes/contato'); // Ajuste se seu arquivo de rotas tiver outro nome

// Função que cria uma instância do Express limpa para testes
function buildApp() {
    const app = express();
    
    // Configurações básicas (mesmas do app.js original)
    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Registra a rota que queremos testar
    app.use('/contato', contatoRoutes);

    // Tratamento de erro simples para não quebrar o teste silenciosamente
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Erro interno no teste');
    });

    return app;
}

module.exports = { buildApp };