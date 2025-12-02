const Contato = require('../../domain/entities/Contato');

class ContatoService {
    constructor(repo) {
        this.repo = repo;
    }

    async listar() {
        return await this.repo.findAll();
    }

    async obter(id) {
        return await this.repo.findById(id);
    }

    async criar(dados) {
        const contato = new Contato(dados);
        return await this.repo.create(contato);
    }

    async atualizar(id, dados) {
        // Garante que o ID do payload é o mesmo da URL
        const contato = new Contato({ ...dados, id: Number(id) });
        return await this.repo.update(contato);
    }

    async excluir(id) {
        return await this.repo.deleteById(id);
    }
}

module.exports = ContatoService;