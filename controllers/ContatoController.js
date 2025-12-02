const { body, validationResult } = require('express-validator');
const createError = require('http-errors');

// Suas validações originais movidas para cá
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

class ContatoController {
    constructor(service) {
        this.service = service;
    }

    // Getter para expor as regras para a rota usar
    get regrasValidacao() {
        return validacoesContato;
    }

    // GET /
    form(req, res) {
        res.render('contato', { title: 'Formulário de Contato', data: {}, errors: {} });
    }

    // GET /lista
    async lista(req, res) {
        const rows = await this.service.listar();
        res.render('contatos-lista', { title: 'Lista de Contatos', contatos: rows });
    }

    // POST /
    async criar(req, res) {
        const errors = validationResult(req);
        // Recriamos o objeto data para re-popular o form em caso de erro
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
            return res.status(400).render('contato', {
                title: 'Formulário de Contato',
                data,
                errors: errors.mapped()
            });
        }

        await this.service.criar(data);
        
        return res.render('sucesso_contato', {
            title: 'Enviado com sucesso',
            data
        });
    }

    // GET /:id/edit
    async editarForm(req, res, next) {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return next(createError(400, 'ID inválido'));

        const contato = await this.service.obter(id);
        if (!contato) return next(createError(404, 'Contato não encontrado'));

        res.render('contato_edit', {
            title: `Editar Contato: ${contato.nome}`,
            data: contato, // A Entidade já tem o formato correto
            errors: {}
        });
    }

    // POST /:id/edit
    async editar(req, res, next) {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return next(createError(400, 'ID inválido'));

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
            return res.status(400).render('contato_edit', {
                title: 'Editar Contato',
                data,
                errors: errors.mapped()
            });
        }

        const atualizado = await this.service.atualizar(id, data);
        if (!atualizado) return next(createError(404, 'Contato não encontrado para atualizar'));

        return res.render('sucesso_edicao', { title: 'Contato Atualizado' });
    }

    // POST /:id/delete
    async excluir(req, res) {
        const id = parseInt(req.params.id, 10);
        if (!Number.isNaN(id)) {
            await this.service.excluir(id);
        }
        return res.redirect('/contato/lista');
    }
}

module.exports = ContatoController;