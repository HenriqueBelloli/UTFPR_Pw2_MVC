const Sequelize = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {

    async getApresentacaoCreate(req, res) {
        const layoutVersao = (req.session.tipousuario == 0 ? 'mainAdm.handlebars' : 'mainCandidato.handlebars')

        return res.render('apresentacao/apresentacaoCreate', { layout: layoutVersao });
    },

    async postApresentacaoCreate(req, res) {

        console.log("Criando nova apresentação...");
        const { musica, participante2, participante3, participante4, participante5, usuarioId } = req.body;
        const votacaoAberta = false;

        await db.Apresentacao.create({ musica, participante2, participante3, participante4, participante5, usuarioId, votacaoAberta});

        console.log("Cadastro criado com sucesso!");

        return res.redirect("/apresentacaoList");

    },

    async getApresentacaoList(req, res) {
        const layoutVersao = (req.session.tipousuario == 0 ? 'mainAdm.handlebars' : 'mainCandidato.handlebars')

        let rawQuery = `SELECT
                            apresentacaos.*,
                            usuarios.nome AS apresentador
                        FROM
                            apresentacaos
                            JOIN usuarios ON (usuarios.id = apresentacaos."usuarioId")
                        `;

        if (req.session.tipousuario != 0) {
            rawQuery += `WHERE apresentacaos."usuarioId" = ${req.session.idUsuario} 
                        `;
        }

        rawQuery += `ORDER BY usuarios.nome, apresentacaos.musica`
      
        const [results, metadata] = await db.sequelize.query(rawQuery);
        res.render("apresentacao/apresentacaoList", {layout: layoutVersao, apresentacoes: results});
    },

    async getApresentacaoEdit(req, res) {
        const layoutVersao = (req.session.tipousuario == 0 ? 'mainAdm.handlebars' : 'mainCandidato.handlebars')

        await db.Apresentacao.findByPk(req.params.id).then(apresentacao => {
            if (req.session.tipousuario != 0 && apresentacao.usuarioId != req.session.idUsuario) {
                return res.redirect("/apresentacaoList");
            }

            res.render('apresentacao/apresentacaoEdit', { layout: layoutVersao, id: apresentacao.id, musica: apresentacao.musica, participante2: apresentacao.participante2, participante3: apresentacao.participante3, participante4: apresentacao.participante4, participante5: apresentacao.participante5 });
        });
    },

    async postApresentacaoEdit(req, res) {
        const { musica, participante2, participante3, participante4, participante5 } = req.body;
        await db.Apresentacao.update({ musica, participante2, participante3, participante4, participante5 }, { where: { id: req.body.id } });
        res.redirect('/apresentacaoList');
    },

    async getApresentacaoDelete(req, res) {

        await db.Apresentacao.findByPk(req.params.id).then(apresentacao => {
            if (req.session.tipousuario != 0 && apresentacao.usuarioId != req.session.idUsuario) {
                return res.redirect("/apresentacaoList");
            }
        });

        await db.Votacao.destroy({ where: { apresentacaoId: req.params.id } });
        await db.Apresentacao.destroy({ where: { id: req.params.id } });
        console.log("Apresentação eliminada");
        res.redirect('/apresentacaoList');
    }
}