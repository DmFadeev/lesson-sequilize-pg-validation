const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Lessons = sequelize.define('lessons', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        status: {
            default: 0,
            type: DataTypes.INTEGER
        }
    })
    
};

