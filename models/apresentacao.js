
module.exports = (sequelize, Sequelize) => {
    const Apresentacao = sequelize.define('apresentacao', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        musica: {
            type: Sequelize.STRING, allowNull: false
        },
        participante2: {
            type: Sequelize.STRING, allowNull: true
        },
        participante3: {
            type: Sequelize.STRING, allowNull: true
        },
        participante4: {
            type: Sequelize.STRING, allowNull: true
        },
        participante5: {
            type: Sequelize.STRING, allowNull: true
        },
        votacaoAberta:{
            type: Sequelize.BOOLEAN, default : false
        }
    });

    return Apresentacao;
}