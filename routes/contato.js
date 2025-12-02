var express = require('express');
var router = express.Router();
const container = require('../container'); // Importa o container criado
const ContatoController = require('../controllers/ContatoController');

// Inicia o controller injetando o service
const controller = new ContatoController(container.contatoService);

// Rota: Formulário Inicial
router.get('/', controller.form.bind(controller));

// Rota: Processar Formulário (com validação)
// Note: controller.regrasValidacao expõe o array do express-validator
router.post('/', controller.regrasValidacao, controller.criar.bind(controller));

// Rota: Listagem
router.get('/lista', controller.lista.bind(controller));

// Rota: Deletar
router.post('/:id/delete', controller.excluir.bind(controller));

// Rota: Formulário de Edição
router.get('/:id/edit', controller.editarForm.bind(controller));

// Rota: Processar Edição (com validação)
router.post('/:id/edit', controller.regrasValidacao, controller.editar.bind(controller));

module.exports = router;