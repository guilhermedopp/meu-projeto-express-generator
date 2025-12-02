const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

function createSequelizeInstance(dbFilePath) {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Garante que a pasta 'data' existe
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    // Define o caminho do banco (novo arquivo para não misturar com o antigo)
    const dbPath = dbFilePath || path.join(dataDir, 'contatos-orm.db');

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false // Mude para true se quiser ver os SQLs no terminal
    });

    return sequelize;
}

module.exports = { createSequelizeInstance };