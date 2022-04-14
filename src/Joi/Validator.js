const moment = require("moment")
const Joi = require('joi');

class Validator {
    static getLesson(req, res, next){
        const schema = Joi.object({
            query: Joi.object(
                {
                    date: Joi
                        .string()
                        .optional()
                        .custom((date,helper) => {
                            const datesArr = date.split(",")
                            if (datesArr.length < 3) {
                                if (datesArr.length === 2) {
                                    if (!(moment(datesArr[1], "YYYY-MM-DD", true).isValid()))
                                        return helper.message("INCORRECT_FILTER_DATE(SECOND_DATE_IS_NOT_ACTUALLY_A_DATE)")
                                }
                                if (!(moment(datesArr[0], "YYYY-MM-DD",true).isValid()))
                                    return helper.message("INCORRECT_FILTER_DATE(FIRST_DATE_IS_NOT_ACTUALLY_A_DATE)")
                            } else
                                return helper.message("INCORRECT_FILTER_DATE(MAXIMUM 2 DATES)")
                        }),
                    status: Joi
                        .number()
                        .optional()
                        .valid(0,1)
                        .error(new Error('PLATFORM_ERROR_STATUS_MUST_BE_1_OR_0')),
                    teacherIds: Joi
                        .string()
                        .optional()
                        .error(new Error('PLATFORM_ERROR_TEACHERIDS_MUST_BE_STRING')),
                    studentsCount:Joi.string()
                        .optional()
                        .custom((studentsCount,helper) => {
                            const students = studentsCount.split(",")
                            if(students.length<3){
                                if(students.length == 2){
                                    if(Number.isNaN(Number.parseInt(students[1])))
                                        return helper.message('PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS')
                                }
                                console.log(Number.isNaN(Number.parseInt(students[0])))
                                if(Number.isNaN(Number.parseInt(students[0])))
                                    return helper.message('PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS')
                            }
                            else{
                                return helper.message('PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS')
                            }
                        }),
                    page: Joi
                        .number()
                        .optional()
                        .error(new Error('PLATFORM_ERROR_PAGE_MUST_BE_INTEGER')),
                    lessonsPerPage: Joi
                        .number()
                        .optional()
                        .error(new Error('PLATFORM_ERROR_LESSONS_PER_PAGE_MUST_BE_INTEGER')),
                },
            ).optional()
        })
        Validator.validateRequest(req, res, next, schema);
    }

    static createLesson(req, res, next){
        const schema = Joi.object({
            body: Joi.object().keys({
                teacherIds: Joi
                    .array()
                    .items(Joi.number().required()).min(1)
                    .error(new Error('PLATFORM_ERROR_TEACHERIDS_MUST_BE_ARRAY_OF_NUMBERS')),
                title: Joi
                    .string()
                    .required()
                    .error(new Error('PLATFORM_ERROR_TITLE_MUST_BE_STRING')),
                days: Joi
                    .array()
                    .items(Joi.number().required())
                    .min(1)
                    .error(new Error('PLATFORM_ERROR_DAYS_MUST_BE_ARRAY_OF_NUMBERS')),
                firstDate: Joi
                    .string()
                    .required()
                    .custom((firstDate,helper) => {
                        if (!(moment(firstDate, "YYYY-MM-DD", true).isValid()))
                            return helper.message("INCORRECT_FIRST_DATE)")
                    }),
                lessonsCount: Joi
                    .number()
                    .error(new Error('PLATFORM_ERROR_LESSONS_COUNT_MUST_BE_INTEGER')),
                lastDate: Joi
                    .string()
                    .custom((lastDate,helper) => {
                        if (!(moment(lastDate, "YYYY-MM-DD", true).isValid()))
                            return helper.message("INCORRECT_LAST_DATE)")
                    }),
            })
        })
        Validator.validateRequest(req, res, next, schema);
    }
    static validateRequest(req, res,next, schema) {
        const options = {
            abortEarly: true,
            allowUnknown: true,
            stripUnknown: true,
            errors:{
                wrap:{
                    label: ''
                }
            }
        };
        const { error, value } = schema.validate(req, options);
        if (error) {
            res.status(400)
            res.send({err: error.message})

        } else {
            req = value;
            next();
        }
    }
}
module.exports = Validator
