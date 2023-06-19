const Sequelize = require('sequelize');

const sequelize = new Sequelize('web2_p1', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
  });

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require('../models/usuario.js')(sequelize, Sequelize);
db.Apresentacao = require('../models/apresentacao.js')(sequelize, Sequelize);
db.Votacao = require('../models/votacao.js')(sequelize, Sequelize);

//Relacionamentos
db.Usuario.hasOne(db.Apresentacao);
db.Usuario.belongsToMany(db.Apresentacao, {through: db.Votacao});

module.exports = db;

