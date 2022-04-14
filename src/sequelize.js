const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://username:pgpwd3rrrr@localhost:5432/testDb')

require('./models/lessons')(sequelize);
require('./models/lesson_students')(sequelize);
require('./models/students')(sequelize);
require('./models/teachers')(sequelize);
require('./models/lesson_teachers')(sequelize);
require('./models/relations')(sequelize);
sequelize.authenticate().then(
    ()=>{
        console.log('connected to database successfully')
    }
)
module.exports = sequelize;



