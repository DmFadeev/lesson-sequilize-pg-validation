const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Students =  sequelize.define('students', {
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
