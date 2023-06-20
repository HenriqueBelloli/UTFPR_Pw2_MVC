const express = require('express');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerApresentacao = require('../controllers/controllerApresentacao');
const controllerVotacao = require('../controllers/controllerVotacao');

const route = express.Router();

module.exports = route;

//Home
route.get("/home", function (req, res) {
  if (req.session.tipousuario == 0)
    return res.render('home', { layout: 'mainAdm.handlebars' });
  else if (req.session.tipousuario == 2)
    return res.render('home', { layout: 'mainCandidato.handlebars' });
  else
    return res.render('home', { layout: 'main.handlebars' });
});

route.get("/logout", controllerUsuario.getLogout);

//Usuario
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/logout", controllerUsuario.getLogout);

route.get("/usuarioCreate", controllerUsuario.getUsuarioCreate);
route.post("/usuarioCadastrar", controllerUsuario.postUsuarioCreate);
route.get("/usuarioList", controllerUsuario.getUsuarioList);
route.get("/usuarioEdit/:id", controllerUsuario.getUsuarioEdit);
route.post("/usuarioEdit", controllerUsuario.postUsuarioEdit);
route.get("/usuarioDelete/:id", controllerUsuario.getUsuarioDelete);

route.get("/usuarioCandidatar", controllerUsuario.getUsuarioCandidatar);

//Apresentação
route.get("/apresentacaoCreate", controllerApresentacao.getApresentacaoCreate);
route.post("/apresentacaoCadastrar", controllerApresentacao.postApresentacaoCreate);
route.get("/apresentacaoList", controllerApresentacao.getApresentacaoList);
route.get("/apresentacaoEdit/:id", controllerApresentacao.getApresentacaoEdit);
route.post("/apresentacaoEdit", controllerApresentacao.postApresentacaoEdit);
route.get("/apresentacaoDelete/:id", controllerApresentacao.getApresentacaoDelete);

//Votação
route.get("/votacaoStatus", controllerVotacao.getVotacaoStatusList);
route.get("/votacaoStatusEdit/:id", controllerVotacao.getvotacaoStatusEdit);
route.get("/votacaoResultado", controllerVotacao.getApresentacaoResultado);
route.get("/votarList", controllerVotacao.getVotacaoList);
route.get("/votar/:id", controllerVotacao.getVotacaoEdit);
route.post("/votarEdit", controllerVotacao.postVotacaoEdit);