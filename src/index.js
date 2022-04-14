const express = require('express')
const Controller = require('./routes/lessons')
const Validator = require("./Joi/Validator")
const bp = require('body-parser')

const app = express()
const port = process.env.port || 4000

app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())
app.get('/', Validator.getLesson,Controller.findLessons)
app.post('/lessons', Validator.createLesson,Controller.createLessons)


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

module.exports = app
