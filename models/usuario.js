
module.exports = (sequelize, Sequelize) => {   
    const Usuario = sequelize.define('usuario', {
        idUsuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true, allowNull: false, primaryKey: true
        },
        login: {
        type: Sequelize.STRING, allowNull: false
        },
        senha: {
            type: Sequelize.STRING, allowNull: false
        },
        tipo: {
            type: Sequelize.ENUM('votante', 'participante', 'admin'), allowNull: false
        },
        pergunta_secreta: {
            type: Sequelize.STRING, allowNull: false
        },
        resposta_pergunta: {
            type: Sequelize.STRING, allowNull: false
        }
    });
    return Usuario;
}