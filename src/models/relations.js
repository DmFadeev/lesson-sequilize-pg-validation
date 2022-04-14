module.exports = (sequelize) => {
    sequelize.models.students.belongsToMany(sequelize.models.lessons, { through: 'lesson_students' });
    sequelize.models.teachers.belongsToMany(sequelize.models.lessons, { through: 'lesson_teachers' });
    sequelize.models.lessons.belongsToMany(sequelize.models.students, { through: "lesson_students" });
    sequelize.models.lessons.belongsToMany(sequelize.models.teachers, { through: "lesson_teachers" });
}