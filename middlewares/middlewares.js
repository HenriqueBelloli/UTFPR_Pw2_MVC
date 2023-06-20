module.exports = {
    logRegister(req, res, next) {
        console.log("url: " + req.url + " method: " + req.method + " " + "user: " + req.session.matricula + " tipoUser: " + req.session.tipousuario);
        next();
    },

    sessionControl(req, res, next) {
        if (req.session.matricula != undefined) next();
        else if ((req.url == '/' || req.url == '/usuarioCreate') && (req.method == 'GET')) {
            next();
        }
        else if ((req.url == '/login' || req.url == '/cadastro') && (req.method == 'POST')) next();
        else return res.redirect('/');
    },

    checkCreate(req, res, next) {
        if (req.url == '/usuarioCadastrar' && req.method == 'POST') {
            if (validarUsuarioCreate(req))
                next();
            else
                res.redirect("/usuarioCreate");
        }
        else if (req.url == '/apresentacaoCadastrar' && req.method == 'POST') {

            if (validarApresentacaoCreate(req))
                next();
            else
                return res.redirect("/apresentacaoCreate");
        }
        else next();
    }
};

function validarUsuarioCreate(req) {
    var matricula = req.body.matricula;
    var nome = req.body.nome;
    var senha = req.body.senha;
    var tipousuario = req.body.tipousuario;

    if (matricula != undefined && nome != undefined && senha != undefined) {
        matricula = matricula.trim();
        nome = nome.trim();
        senha = senha.trim();

        if (!(matricula.length > 0 && nome.length > 0 && senha.length > 0)) {
            console.log("Dados inválidos");
            return false;
        }
    } else {
        console.log("Dados incompletos");
        return false;
    }

    tipousuario = (tipousuario != undefined ? 0 : 1);

    req.matricula = matricula;
    req.nome = nome;
    req.senha = senha;
    req.tipousuario = tipousuario;

    return true;
}

function validarApresentacaoCreate(req) {
    var musica = req.body.musica;
    var usuarioId = req.session.idUsuario;

    if (musica == undefined) {
        console.log("Não informado musica");
        return false;
    }
    if (musica.length <= 0 || usuarioId == undefined) {
        console.log("Problema com os dados");
        return false;
    }

    req.body.musica = musica;
    req.body.usuarioId = usuarioId;

    return true;
}