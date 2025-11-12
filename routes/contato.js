var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
var createError = require('http-errors');

router.get('/', (req, res) => {
  res.render('contato', {
    title: 'Formulário de Contato',
    data: {},
    errors: {}
  });
});

router.get('/lista', (req, res) => {
  const rows = db.prepare(`
    SELECT id, nome, email, idade, genero, interesses, mensagem, criado_em
    FROM contatos
    ORDER BY criado_em DESC
  `).all();

  res.render('contatos-lista', {
    title: 'Lista de Contatos',
    contatos: rows
  });
});

router.post('/:id/delete', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.redirect('/contato/lista');
  }
  const info = db.prepare('DELETE FROM contatos WHERE id = ?').run(id);

  if (info.changes === 0) { 
    console.log('Nenhum registro com esse ID para deletar'); 
  }
  return res.redirect('/contato/lista');
});

const validacoesContato = [
  body('nome')
    .trim().isLength({ min: 3, max: 60 }).withMessage('Nome deve ter entre 3 e 60 caracteres.')
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/).withMessage('Nome contém caracteres inválidos.')
    .escape(),
  body('email')
    .trim().isEmail().withMessage('E-mail inválido.')
    .normalizeEmail(),
  body('idade')
    .trim().optional({ checkFalsy: true })
    .isInt({ min: 1, max: 120 }).withMessage('Idade deve ser um inteiro entre 1 e 120.')
    .toInt(),
  body('genero')
    .isIn(['', 'feminino', 'masculino', 'nao-binario', 'prefiro-nao-informar'])
    .withMessage('Gênero inválido.'),
  body('interesses')
    .optional({ checkFalsy: true })
    .customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : []))
    .custom((arr) => {
      const valid = ['node', 'express', 'ejs', 'frontend', 'backend'];
      return arr.every(x => valid.includes(x));
    }).withMessage('Interesse inválido.'),
  body('mensagem')
    .trim().isLength({ min: 10, max: 500 }).withMessage('Mensagem deve ter entre 10 e 500 caracteres.')
    .escape(),
  body('aceite')
    .equals('on').withMessage('Você deve aceitar os termos para continuar.')
];

router.post('/', validacoesContato, (req, res) => {
  const errors = validationResult(req);
  const data = {
    nome: req.body.nome,
    email: req.body.email,
    idade: req.body.idade,
    genero: req.body.genero || '',
    interesses: req.body.interesses || [],
    mensagem: req.body.mensagem,
    aceite: req.body.aceite === 'on'
  };

  if (!errors.isEmpty()) {
    const mapped = errors.mapped();
    return res.status(400).render('contato', {
      title: 'Formulário de Contato',
      data,
      errors: mapped
    });
  }
  
  const stmt = db.prepare(`
      INSERT INTO contatos (nome, email, idade, genero, interesses, mensagem, aceite, criado_em)
      VALUES (@nome, @email, @idade, @genero, @interesses, @mensagem, @aceite, @criado_em)
  `);

  stmt.run({
    nome: data.nome,
    email: data.email,
    idade: data.idade || null,
    genero: data.genero || null,
    interesses: data.interesses.join(','),
    mensagem: data.mensagem,
    aceite: data.aceite ? 1 : 0,
    criado_em: new Date().toLocaleString('sv-SE')
  });

  return res.render('sucesso_contato', {
    title: 'Enviado com sucesso',
    data
  });
});

router.get('/:id/edit', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return next(createError(400, 'ID de contato inválido'));
  }

  const contato = db.prepare('SELECT * FROM contatos WHERE id = ?').get(id);

  if (!contato) {
    return next(createError(404, 'Contato não encontrado'));
  }

  const dataParaView = {
    id: contato.id,
    nome: contato.nome,
    email: contato.email,
    idade: contato.idade,
    genero: contato.genero || '',
    mensagem: contato.mensagem,
    interesses: contato.interesses ? contato.interesses.split(',') : [],
    aceite: contato.aceite === 1
  };
  
  res.render('contato_edit', {
    title: `Editar Contato: ${contato.nome}`,
    data: dataParaView,
    errors: {}
  });
});

router.post('/:id/edit', validacoesContato, (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return next(createError(400, 'ID de contato inválido'));
  }
  
  const errors = validationResult(req);
  
  const data = {
    id: id,
    nome: req.body.nome,
    email: req.body.email,
    idade: req.body.idade,
    genero: req.body.genero || '',
    interesses: req.body.interesses || [],
    mensagem: req.body.mensagem,
    aceite: req.body.aceite === 'on'
  };

  if (!errors.isEmpty()) {
    const mapped = errors.mapped();
    return res.status(400).render('contato_edit', {
      title: 'Editar Contato',
      data,
      errors: mapped
    });
  }

  const stmt = db.prepare(`
      UPDATE contatos SET 
        nome = @nome, 
        email = @email, 
        idade = @idade, 
        genero = @genero, 
        interesses = @interesses, 
        mensagem = @mensagem, 
        aceite = @aceite
      WHERE id = @id
  `);

  const info = stmt.run({
    id: id,
    nome: data.nome,
    email: data.email,
    idade: data.idade || null,
    genero: data.genero || null,
    interesses: data.interesses.join(','),
    mensagem: data.mensagem,
    aceite: data.aceite ? 1 : 0
  });

  if (info.changes === 0) {
    return next(createError(404, 'Contato não encontrado para atualizar'));
  }

  return res.render('sucesso_edicao', {
    title: 'Contato Atualizado'
  });
});

module.exports = router;