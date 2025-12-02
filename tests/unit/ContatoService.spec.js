const ContatoService = require('../../application/services/ContatoService');
const FakeRepo = require('../testUtils/fakeContatoRepository');

describe('ContatoService (unit)', () => {
    
    test('deve criar, listar, atualizar e excluir um contato', async () => {
        // 1. Preparação: Cria o Service com o Repo Falso
        const repo = new FakeRepo();
        const service = new ContatoService(repo);

        // 2. Teste de CRIAÇÃO
        const novoContato = {
            nome: 'Ana Teste',
            email: 'ana@ex.com',
            idade: 30,
            genero: 'feminino',
            interesses: ['node', 'jest'],
            mensagem: 'Testando services',
            aceite: true
        };

        const criado = await service.criar(novoContato);
        
        // Verificações (Assertions)
        expect(criado).toBeDefined();
        expect(criado.id).toBe(1); // O fake repo começa em 1
        expect(criado.nome).toBe('Ana Teste');

        // 3. Teste de LISTAGEM
        const lista = await service.listar();
        expect(lista.length).toBe(1);
        expect(lista[0].email).toBe('ana@ex.com');

        // 4. Teste de ATUALIZAÇÃO
        const atualizado = await service.atualizar(criado.id, { nome: 'Ana Editada' });
        expect(atualizado.nome).toBe('Ana Editada');
        
        // Verifica se persistiu a alteração
        const busca = await service.obter(criado.id);
        expect(busca.nome).toBe('Ana Editada');

        // 5. Teste de EXCLUSÃO
        await service.excluir(criado.id);
        const listaFinal = await service.listar();
        expect(listaFinal.length).toBe(0);
    });
});