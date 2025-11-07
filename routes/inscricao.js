var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('inscricao', { 
    title: 'Formulário de Inscrição', 
    data: {}, 
    errors: {} 
  });
});

router.post('/', function(req, res, next) {
    const data = req.body;
    let errors = {}; 

    if (!data.nome || data.nome.trim() === '') {
        errors.nome = { msg: 'O campo Nome é obrigatório.' };
    }

    if (!data.email || !data.email.includes('@')) {
        errors.email = { msg: 'Por favor, insira um email válido.' };
    }

    if (!data.tipoIngresso || data.tipoIngresso === '') {
        errors.tipoIngresso = { msg: 'Você deve selecionar um tipo de ingresso.' };
    }

    if (!data.termos) {
        errors.termos = { msg: 'Você deve aceitar os termos de uso.' };
    }
    
    if (Object.keys(errors).length > 0) {
        res.render('inscricao', { 
            title: 'Formulário de Inscrição', 
            errors: errors, 
            data: data 
        });
    } else {
        res.render('sucesso', { 
            title: 'Inscrição Confirmada', 
            data: data,
            backLink: { 
                url: '/inscricao', 
                text: 'Fazer outra inscrição' 
            }
        });
    }
});

module.exports = router;