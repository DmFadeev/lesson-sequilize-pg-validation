const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Teachers = sequelize.define('teachers', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
    })
}
