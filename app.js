
const routes = require('./routers/route');
const handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const middlewares = require('./middlewares/middlewares');
const express = require('express');
const db = require('./config/db_sequelize');
const app = express();

app.use(cookieParser());
app.use(session({ secret: 'textosecreto', saveUninitialized: true, cookie: { maxAge: 30 * 60 * 1000 } }));
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static("images"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.logRegister, middlewares.sessionControl, middlewares.checkCreate);
app.use(routes);

app.use(
    express.urlencoded({
        extended: true
    })
)
/*
db.sequelize.sync({force: true}).then(() => {
    console.log('{ force: true } | Gerando Banco de Dados. Aguarde...');
    db.Usuario.create({
        matricula: 'admin',
        nome: 'Administrador',
        senha: '123',
        tipousuario: 0
    });
});*/

app.listen(8082, function () {
    console.log("Servidor no http://localhost:8082")
});