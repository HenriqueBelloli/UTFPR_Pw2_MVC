const Sequelize = require('sequelize');
const db = require('../config/db_sequelize');

module.exports = {

    async getVotacaoStatusList(req, res) {
        let rawQuery = `SELECT
                            apresentacaos.*,
                            usuarios.nome AS apresentador,
                            CASE WHEN apresentacaos."votacaoAberta" THEN 'Aberta' ELSE 'Fechada' END AS votacaostatus
                        FROM
                            apresentacaos
                            JOIN usuarios ON (usuarios.id = apresentacaos."usuarioId")
                        ORDER BY
                            usuarios.nome,
                            apresentacaos.musica
                        `;

        const [results, metadata] = await db.sequelize.query(rawQuery);
        res.render("votacao/votacaoStatus", {layout: 'mainAdm.handlebars', apresentacoes: results});
    },

    async getvotacaoStatusEdit(req, res) {

        await db.Apresentacao.findByPk(req.params.id).then(apresentacao => {
            const status = (apresentacao.votacaoAberta ? false : true);

            db.Apresentacao.update({ votacaoAberta: status}, { where: { id: req.params.id } });
            console.log("Status alterado");
        });

        res.redirect('/votacaoStatus');
    },

    async getVotacaoList(req, res) {
        const layoutVersao = (req.session.tipousuario == 1 ? 'main.handlebars' : 'mainCandidato.handlebars')

        let rawQuery = `SELECT
                            apresentacaos.*,
                            usuarios.nome AS apresentador,
                            COALESCE(votacaos.Nota, 0) AS nota
                        FROM
                            apresentacaos
                            JOIN usuarios ON (usuarios.id = apresentacaos."usuarioId")
                            LEFT JOIN votacaos ON (votacaos."apresentacaoId" = apresentacaos.id AND votacaos."usuarioId" = ${req.session.idUsuario})
                        WHERE
                            apresentacaos."votacaoAberta"
                        ORDER BY
                            usuarios.nome,
                            apresentacaos.musica
                        `;

        const [results, metadata] = await db.sequelize.query(rawQuery);
        res.render("votacao/votacaoList", {layout: layoutVersao, apresentacoes: results});
    },

    async getVotacaoEdit(req, res) {
        const layoutVersao = (req.session.tipousuario == 1 ? 'main.handlebars' : 'mainCandidato.handlebars')
        const apresentacaoId = req.params.id;
        const usuarioId = req.session.idUsuario;

        const rawQuery =`SELECT
                            apresentacaos.musica,
                            COALESCE(votacaos.Nota, 0) AS nota
                         FROM
                            apresentacaos
                            LEFT JOIN votacaos ON (votacaos."apresentacaoId" = apresentacaos.id AND votacaos."usuarioId" = ${usuarioId})
                         WHERE
                         apresentacaos.id = ${apresentacaoId}
                        `
        const [votacao, metadata] = await db.sequelize.query(rawQuery);
        console.log(votacao);
        res.render('votacao/votacaoEdit', { layout: layoutVersao, id: apresentacaoId, musica: votacao.musica, nota: votacao.nota });
    },

    async postVotacaoEdit(req, res) {

        const {apresentacaoId, nota } = req.body;
        const usuarioId = req.session.idUsuario;

        const votacaoExistente = await db.Votacao.findAll( { where: { apresentacaoId: req.body.apresentacaoId, usuarioId: usuarioId } });

        if (votacaoExistente.length > 0) {
            await db.Votacao.update({ nota }, { where: { apresentacaoId: req.body.apresentacaoId, usuarioId: usuarioId } });
        }else{
            await db.Votacao.create({ apresentacaoId, usuarioId, nota});
        }

        console.log("Voto registrada");
        res.redirect('/votarList');
    },

    async getApresentacaoResultado(req, res) {

        let rawQuery = `SELECT apresentacaos.id,
                               apresentacaos.Musica,
                               usuarios.nome AS apresentador,
                               COALESCE(VotacoesDados.notaMedia, 0) AS notamedia
                        FROM 
                            (SELECT votacaos."apresentacaoId", AVG(votacaos.nota)::Numeric(7,2) AS notaMedia
                             FROM votacaos
                             GROUP BY votacaos."apresentacaoId") AS VotacoesDados
                            RIGHT JOIN apresentacaos ON (apresentacaos.id = VotacoesDados."apresentacaoId")
                            JOIN usuarios ON (usuarios.id = apresentacaos."usuarioId")
                        ORDER BY notaMedia DESC
                        `;

        const [results, metadata] = await db.sequelize.query(rawQuery);
        res.render("votacao/votacaoResultado", {layout: 'mainAdm.handlebars', apresentacoes: results});
    }
}