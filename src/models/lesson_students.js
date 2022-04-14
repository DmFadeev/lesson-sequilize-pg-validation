const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const lesson_students = sequelize.define('lesson_students', {
        visit: {
            allowNull: false,
            type: DataTypes.INTEGER,
        }
    }, { timestamps: false });
}
