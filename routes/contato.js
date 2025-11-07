var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contato', { 
    title: 'Formulário de Contato', 
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
    if (!data.mensagem || data.mensagem.trim().length < 10) {
        errors.mensagem = { msg: 'A mensagem é obrigatória (mín. 10 caracteres).' };
    }
    if (!data.aceite) {
        errors.aceite = { msg: 'Você deve aceitar os termos de uso.' };
    }
    
    if (Object.keys(errors).length > 0) {
        res.render('contato', { 
            title: 'Formulário de Contato', 
            errors: errors, 
            data: data 
        });
    } else {
        res.render('sucesso_contato', { 
            title: 'Contato Recebido', 
            data: data
        });
    }
});

module.exports = router;