const Sequelize = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {
    async getLogin(req, res) {
        res.render('usuario/login', { layout: 'noMenu.handlebars' });
    },

    async postLogin(req, res) {
        console.log("req.body.matricula: " + req.body.matricula);

        db.Usuario.findAll({ where: { matricula: req.body.matricula, senha: req.body.senha } }
        ).then(usuarios => {
            if (usuarios.length > 0) {
                var tipousuario = usuarios[0].tipousuario;
                req.session.matricula = req.body.matricula;
                req.session.tipousuario = tipousuario;
                req.session.idUsuario = usuarios[0].id;
                console.log("LOGIN COM O ID " + usuarios[0].id);
                res.redirect('/home');
            }
            else {
                res.redirect('/');
            }
        });
    },

    async getLogout(req, res) {
        req.session.matricula = undefined;
        req.session.tipousuario = undefined;
        res.redirect("/");
    },

    async getUsuarioCreate(req, res) {
        if (req.session.tipousuario != undefined)
            if (req.session.tipousuario == 0)
                return res.render('usuario/cadastroAdm', { layout: 'mainAdm.handlebars' });
            else
                return res.render('usuario/cadastro', { layout: 'main.handlebars' });

        return res.render('usuario/cadastro', { layout: 'noMenu.handlebars' });
    },

    async postUsuarioCreate(req, res) {
        db.Usuario.findAll({ where: { matricula: req.matricula } }
        ).then(usuarios => {
            if (usuarios.length > 0) {
                console.error("Erro: Cadastro já existente.");
                return res.redirect('/usuarioCreate');
            }
            else {
                console.log("Criando novo usuário...");
                db.Usuario.create({
                    matricula: req.matricula,
                    nome: req.nome,
                    senha: req.senha,
                    tipousuario: req.tipousuario
                });

                console.log("Cadastro criado com sucesso!");

                return res.redirect("/usuarioList");
            }
        });
    },

    async getUsuarioList(req, res) {
        db.Usuario.findAll({ where: { tipousuario: [1, 2] } }).then(usuarios => {
            for (var i = 0; i < usuarios.length; i++) {
                switch (usuarios[i].tipousuario) {
                    case 0:
                        usuarios[i].tipousuario = "Administrador";
                        break;
                    case 1:
                        usuarios[i].tipousuario = "Votante";
                        break;
                    case 2:
                        usuarios[i].tipousuario = "Candidato";
                        break;
                }
            }
            res.render('usuario/usuarioList', { layout: 'mainAdm.handlebars', usuarios: usuarios.map(usuarios => usuarios.toJSON()) });
        });
    },

    async getUsuarioEdit(req, res) {
        await db.Usuario.findByPk(req.params.id).then(usuario => {
            res.render('usuario/usuarioEdit', { layout: 'mainAdm.handlebars', id: usuario.id, matricula: usuario.matricula, nome: usuario.nome, senha: usuario.senha });
        });
    },

    async postUsuarioEdit(req, res) {
        const { matricula, nome, senha } = req.body;
        await db.Usuario.update({ matricula, nome, senha }, { where: { id: req.body.id } });
        res.redirect('/usuarioList');
    },

    async getUsuarioDelete(req, res) {
        await db.Votacao.destroy({ where: { usuarioId: req.params.id } });
        await db.Apresentacao.destroy({ where: { usuarioId: req.params.id } });
        await db.Usuario.destroy({ where: { id: req.params.id } });
        console.log("Usuário eliminado");
        res.redirect('/usuarioList');
    },

    async getUsuarioCandidatar(req, res) {
        const usuarioId = req.session.idUsuario;
        await db.Usuario.update({ tipousuario: 2 }, { where: { id: usuarioId } });
        req.session.tipousuario = 2;
        console.log("Usuário alterado para candidato");
        res.redirect('/home');
    }
}