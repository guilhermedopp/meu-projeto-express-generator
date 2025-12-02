const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineContatoModel } = require('../infra/db/models/ContatoModel');
const ContatoRepositorySequelize = require('../infra/repositories/ContatoRepositorySequelize');
const ContatoService = require('../application/services/ContatoService');

// 1. Cria a conexão ORM
const sequelize = createSequelizeInstance();

// 2. Define o modelo (Tabela)
const ContatoModel = defineContatoModel(sequelize);

// 3. Sincroniza o banco (Cria a tabela se não existir)
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado (ORM).'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

// 4. Cria o repositório injetando o MODELO, não o banco cru
const contatoRepository = new ContatoRepositorySequelize(ContatoModel);

// 5. O Service continua igual (a mágica da arquitetura!)
const contatoService = new ContatoService(contatoRepository);

module.exports = {
    contatoService
};