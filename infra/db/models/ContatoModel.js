const { DataTypes } = require('sequelize');

function defineContatoModel(sequelize) {
    const ContatoModel = sequelize.define('Contato', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        idade: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        genero: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        // O SQLite não tem array nativo, então guardamos como String
        interesses: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mensagem: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        aceite: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'contatos',
        timestamps: true,       // Cria createdAt e updatedAt automaticamente
        createdAt: 'criado_em', // Mapeia para o nome que já usamos
        updatedAt: 'atualizado_em'
    });

    return ContatoModel;
}

module.exports = { defineContatoModel };