const ContatoRepository = require('../../domain/ports/ContatoRepository');
const Contato = require('../../domain/entities/Contato');

class FakeContatoRepository extends ContatoRepository {
    constructor() {
        super();
        this._data = []; // O "banco" é apenas um array
        this._id = 1;    // Simula o AUTOINCREMENT
    }

    async create(contato) {
        // Simula a criação de ID e persistência
        const c = new Contato({ ...contato, id: this._id++ });
        this._data.push(c);
        return c;
    }

    async update(contato) {
        const idx = this._data.findIndex(x => x.id === contato.id);
        if (idx === -1) return null;
        
        // Atualiza os dados mantendo o ID original
        const merged = new Contato({ ...this._data[idx], ...contato });
        this._data[idx] = merged;
        return merged;
    }

    async deleteById(id) {
        this._data = this._data.filter(x => x.id !== id);
    }

    async findAll() {
        // Retorna uma cópia do array para segurança
        return this._data.slice();
    }

    async findById(id) {
        return this._data.find(x => x.id === id) || null;
    }
}

module.exports = FakeContatoRepository;