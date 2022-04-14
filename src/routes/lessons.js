const moment = require("moment");
const Service = require("../service/service")

const sequelize = require('../sequelize')

class Controller {
    static async findLessons(req, res) {
        const filters = req.query
        const conditions = {}
        const teachers = []
        let lim = 5;
        let off = 0;
        let studentsCount
        if (filters) {
            if (filters.title) {
                conditions['title'] = filters.title
            }
            //status
            if (filters.status) {
                conditions['status'] = filters.status
            }
            //studentsCount
            if (filters.studentsCount) {
                studentsCount = filters.studentsCount
                const less = await sequelize.models.lesson_students.findAll({where: {'visit': studentsCount},attributes: ['id']})
                conditions['id'] = less
            }
            //teacherIDS
            if (filters.teacherIds) {
                teachers.push((filters.teacherIds.split(",")).map((el)=>{
                    return Number.parseInt(el,10)
                }))
            }
            //lessonsPerPage
            if (filters.lessonsPerPage) {
                lim = filters.lessonsPerPage
            }
            //page
            if (filters.page) {
                off = lim * filters.page
            }
            //date
            if (filters.date) {
                const datesArr = filters.date.split(",")
                if (datesArr.length === 2)
                    conditions['date'] = {$gte: datesArr[0], $lte: datesArr[1]}
                else if (datesArr.length === 1) {
                    conditions['date'] = datesArr[0]
                }
            }
        }
        let result
        if(filters.teacherIds){
            result = await sequelize.models.lessons.findAll({
                where: conditions,
                limit: lim,
                offset: off,
                include:{
                    model: sequelize.models.teachers,
                    as:'teachers',
                    where: {'id': teachers}
                }
            })
        }
        else{
            result = await sequelize.models.lessons.findAll({
                where: conditions,
                limit: lim,
                offset: off,
            })
        }

        res.send({status:"OK",result})
    }
    static async createLessons(req, res) {
        const info = req.body
        if ((!info.lastDate && !info.lessonsCount) || (info.lastDate && info.lessonsCount)) {
            return res.status(400).send({err:"PLATFORM_ERR_LASTDATE_OR_LESSONS_COUNT"})
        }
        let finalLessonsArr = []
        let createdLessonsCount = 0;
        let lessonDate = moment(info.firstDate).format("YYYY-MM-DD")

        const maxDate = moment(lessonDate).add(1, 'y')
        const dayOfWeek = new Date(info.firstDate).getDay()
        const sortedDays = info.days.sort()
        if (info.lastDate) {
            const finalDate = moment(info.lastDate).format("YYYY-MM-DD")
            for (let i = 0; i < sortedDays.length; i++) {
                if (sortedDays[i] > dayOfWeek) {
                    const elDate = moment(info.firstDate).add(sortedDays[i] - dayOfWeek, 'd')
                    if (moment(finalDate).isAfter(moment(elDate), 'day')) {
                        const lesson = await sequelize.models.lessons.create({
                            title: info.title,
                            date: elDate,
                            status: 0,
                        })
                        info.teacherIds.forEach(async( elem)=>{
                            await lesson.addTeachers(elem, { through: { selfGranted: false } })
                        })
                        createdLessonsCount++
                        finalLessonsArr.push(lesson.id)
                    } else return res.send({ids: finalLessonsArr})
                }
            }
            lessonDate = moment(info.firstDate).add(7 - dayOfWeek, 'd').format('YYYY-MM-DD')
            while (true) {
                for (let i = 0; i < sortedDays.length; i++) {
                    const elDate = moment(lessonDate).add(sortedDays[i], 'days').format('YYYY-MM-DD')
                    if (moment(maxDate).isAfter(moment(elDate), 'day') && moment(finalDate).isAfter(moment(elDate), 'day') && createdLessonsCount <= 300) {
                        const lesson = await sequelize.models.lessons.create({
                            title: info.title,
                            date: elDate,
                            status: 0,
                        })
                        info.teacherIds.forEach(async( elem)=>{
                            await lesson.addTeachers(elem, { through: { selfGranted: false } })
                        })
                        createdLessonsCount++
                        finalLessonsArr.push(lesson.id)
                    } else return res.send({ids: finalLessonsArr})
                }
                lessonDate = moment(lessonDate).add(7, 'days').format('YYYY-MM-DD')
            }
            return res.send({ids: finalLessonsArr})
        }
        else {
            for(let i = 0; i < sortedDays.length; i++){
                if(sortedDays[i]>dayOfWeek){
                    const elDate = moment(info.firstDate).add(sortedDays[i]-dayOfWeek, 'd')
                    if(createdLessonsCount < info.lessonsCount){
                        const lesson = await sequelize.models.lessons.create({
                            title: info.title,
                            date: elDate,
                            status: 0,
                        })
                        info.teacherIds.forEach(async( elem)=>{
                            await lesson.addTeachers(elem, { through: { selfGranted: false } })
                        })
                        createdLessonsCount++
                        finalLessonsArr.push(lesson.id)
                    }
                    else return res.send({ids:finalLessonsArr})
                }
            }
            lessonDate = moment(info.firstDate).add(7-dayOfWeek, 'd').format('YYYY-MM-DD')
            while (true) {
                for(let i = 0; i < sortedDays.length; i++){
                    const elDate = moment(lessonDate).add(sortedDays[i], 'days').format('YYYY-MM-DD')
                    if(moment(maxDate).isAfter(moment(elDate),'day') && createdLessonsCount <= info.lessonsCount && createdLessonsCount <= 300){
                        const lesson = await sequelize.models.lessons.create({
                            title: info.title,
                            date: elDate,
                            status: 0,
                        })
                        info.teacherIds.forEach(async( elem)=>{
                            await lesson.addTeachers(elem, { through: { selfGranted: false } })
                        })
                        createdLessonsCount++
                        finalLessonsArr.push(lesson.id)
                    }
                    else return res.send({ids:finalLessonsArr})
                }
                lessonDate = moment(lessonDate).add(7, 'days').format('YYYY-MM-DD')
            }
            return res.send({ids:finalLessonsArr})
        }
    }
}

module.exports = Controller
