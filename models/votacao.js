
module.exports = (sequelize, Sequelize) => {
    const Votacao = sequelize.define('votacao', {
        nota: {
            type: Sequelize.INTEGER, allowNull: false
        }
    });

    return Votacao;
}