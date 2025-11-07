var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('bug_report', {
    title: 'Relatório de Bug',
    data: {},
    errors: {}
  });
});

router.post('/', function(req, res, next) {
    const data = req.body;
    let errors = {};

    if (!data.titulo || data.titulo.trim() === '') {
        errors.titulo = { msg: 'O resumo do bug é obrigatório.' };
    }
    if (!data.modulo || data.modulo.trim() === '') {
        errors.modulo = { msg: 'O módulo é obrigatório.' };
    }
    if (!data.prioridade || data.prioridade === '') {
        errors.prioridade = { msg: 'Selecione uma prioridade.' };
    }
    if (!data.descricao || data.descricao.trim().length < 10) {
        errors.descricao = { msg: 'Descreva os passos (mínimo 10 caracteres).' };
    }
    if (!data.dataEncontrada) {
        errors.dataEncontrada = { msg: 'A data é obrigatória.' };
    } else {
        const hojeString = new Date().toISOString().split('T')[0];
        if (data.dataEncontrada > hojeString) {
            errors.dataEncontrada = { msg: 'A data não pode ser no futuro.' };
        }
    }

    if (Object.keys(errors).length > 0) {
        res.render('bug_report', {
            title: 'Relatório de Bug',
            errors: errors,
            data: data
        });
    } else {
        res.render('sucesso_bug', {
            title: 'Bug Reportado com Sucesso',
            data: data
        });
    }
});

module.exports = router;