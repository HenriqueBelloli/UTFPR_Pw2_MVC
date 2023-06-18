
const routes = require('./routers/route');

const handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const middlewares = require('./middlewares/middlewares');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: 'textosecreto', saveUninitialized: true, cookie: { maxAge: 30 * 60 * 1000 } }));
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.logRegister, middlewares.sessionControl)
app.use(routes);

app.use(
    express.urlencoded({
        extended: true
    })
)

app.listen(8081, function () {
    console.log("Servidor no http://localhost:8081")
});