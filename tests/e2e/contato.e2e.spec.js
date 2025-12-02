const request = require('supertest');
const { buildApp } = require('../testUtils/appFactory');

describe('Rotas de Contato (E2E)', () => {
    let app;

    beforeAll(() => {
        // Constrói o app Express usando a factory de teste
        app = buildApp();
    });

    test('GET /contato/lista deve responder com status 200 e HTML', async () => {
        const res = await request(app).get('/contato/lista');
        
        // Verifica se deu sucesso (HTTP 200)
        expect(res.status).toBe(200);
        
        // Verifica se retornou HTML
        expect(res.headers['content-type']).toMatch(/html/);
        
        // Verifica se tem o título da tabela
        expect(res.text).toContain('Lista de Contatos');
    });

    test('POST /contato deve criar novo contato e retornar sucesso', async () => {
        const res = await request(app)
            .post('/contato')
            .type('form') // Simula envio de formulário HTML
            .send({
                nome: 'João da Silva', // CORRIGIDO: Apenas letras, sem números
                email: 'joao.silva@teste.com',
                idade: '25',
                genero: '', // Vazio é permitido na sua validação
                interesses: ['node', 'backend'],
                mensagem: 'Esta é uma mensagem válida de teste com mais de 10 caracteres',
                aceite: 'on'
            });

        // Debug: Se der erro 400, imprime o HTML para vermos qual campo falhou
        if (res.status === 400) {
            console.error('ALERTA DE ERRO DE VALIDAÇÃO:', res.text);
        }

        expect(res.status).toBe(200);
        expect(res.text).toContain('Enviado com sucesso');
    });
});