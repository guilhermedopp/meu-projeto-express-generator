const ContatoRepository = require('../../domain/ports/ContatoRepository');
const Contato = require('../../domain/entities/Contato');

class ContatoRepositorySequelize extends ContatoRepository {
    constructor(ContatoModel) {
        super();
        this.ContatoModel = ContatoModel;
    }

    // Converte do formato do Sequelize para a nossa Entidade de Domínio
    _modelToEntity(modelData) {
        if (!modelData) return null;
        
        // O Sequelize retorna o objeto puro com .toJSON()
        const data = modelData.toJSON ? modelData.toJSON() : modelData;

        return new Contato({
            id: data.id,
            nome: data.nome,
            email: data.email,
            idade: data.idade,
            genero: data.genero,
            // O model já nos entrega a string, a Entidade faz o split
            interesses: data.interesses,
            mensagem: data.mensagem,
            aceite: data.aceite,
            criadoEm: data.criado_em
        });
    }

    async create(contato) {
        // Converte array de interesses para string antes de salvar
        const interessesStr = Array.isArray(contato.interesses) 
            ? contato.interesses.join(',') 
            : '';

        const novoModelo = await this.ContatoModel.create({
            nome: contato.nome,
            email: contato.email,
            idade: contato.idade || null,
            genero: contato.genero,
            interesses: interessesStr,
            mensagem: contato.mensagem,
            aceite: contato.aceite
        });

        return this._modelToEntity(novoModelo);
    }

    async findAll() {
        const models = await this.ContatoModel.findAll({
            order: [['criado_em', 'DESC']]
        });
        return models.map(m => this._modelToEntity(m));
    }

    async findById(id) {
        const model = await this.ContatoModel.findByPk(id);
        return this._modelToEntity(model);
    }

    async update(contato) {
        const interessesStr = Array.isArray(contato.interesses) 
            ? contato.interesses.join(',') 
            : '';

        const [afetados] = await this.ContatoModel.update({
            nome: contato.nome,
            email: contato.email,
            idade: contato.idade || null,
            genero: contato.genero,
            interesses: interessesStr,
            mensagem: contato.mensagem,
            aceite: contato.aceite
        }, {
            where: { id: contato.id }
        });

        if (afetados === 0) return null;
        return this.findById(contato.id);
    }

    async deleteById(id) {
        await this.ContatoModel.destroy({ where: { id } });
    }
}

module.exports = ContatoRepositorySequelize;