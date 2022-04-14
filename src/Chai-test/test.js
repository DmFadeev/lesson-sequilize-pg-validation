const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../index")

chai.use(chaiHttp);
describe('test', () => {
    const host = "localhost:4000";
    describe('/', () => {
        const path = "/";
        describe('проверка на дату(date)', () => {
            it('первая дата', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            date: "109opd32"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("INCORRECT_FILTER_DATE(FIRST_DATE_IS_NOT_ACTUALLY_A_DATE)");
                        chai.expect(res).to.have.status(400)
                    });
            })
            it('вторая дата', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            date: "10-09-1998,109opd32"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("INCORRECT_FILTER_DATE(SECOND_DATE_IS_NOT_ACTUALLY_A_DATE)");
                        chai.expect(res).to.have.status(400)
                    });
            })
            it('нормальный запрос', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            "title":"Green Color"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.undefined;
                        chai.expect(res).to.have.status(200)
                    })
            })
            it('дат больше двух', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            date: "1998-09-21,1888-08-12,1200-10-21"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("INCORRECT_FILTER_DATE(MAXIMUM 2 DATES)");
                        chai.expect(res).to.have.status(400)
                    });
            })
        })
        it('статус', () => {
            chai
                .request(app)
                .get(path)
                .query(
                    {
                        status: "4"
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_STATUS_MUST_BE_1_OR_0");
                    chai.expect(res).to.have.status(400)
                });
        })
        it('teacherIds', () => {
            chai
                .request(app)
                .get(path)
                .query(
                    {
                        teacherIds: {"34":67}
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_TEACHERIDS_MUST_BE_STRING");
                    chai.expect(res).to.have.status(400)
                });
        })

        describe('проверка на количество учеников(studentsCount)', () => {
            it('studentsCount больше двух', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            studentsCount: "10,3,4"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS");
                        chai.expect(res).to.have.status(400)
                    });
            })
            it('studentsCount[1] - число', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            studentsCount: "10,n"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS");
                        chai.expect(res).to.have.status(400)
                    });
            })
            it('studentsCount[0] - число', () => {
                chai
                    .request(app)
                    .get(path)
                    .query(
                        {
                            studentsCount: "n,3"
                        }
                    )
                    .end(function(error, res, body) {
                        chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_STUDENTS_COUNT_MUST_BE_INTEGER_OR__2_INTEGERS");
                        chai.expect(res).to.have.status(400)
                    });
            })
        });
        it('page', () => {
            chai
                .request(app)
                .get(path)
                .query(
                    {
                        page: "dgopa"
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_PAGE_MUST_BE_INTEGER");
                    chai.expect(res).to.have.status(400)
                });
        })
        it('lessonsPerPage', () => {
            chai
                .request(app)
                .get(path)
                .query(
                    {
                        lessonsPerPage: "dgopa"
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_LESSONS_PER_PAGE_MUST_BE_INTEGER");
                    chai.expect(res).to.have.status(400)
                });
        })
    })

    //api lessons
    describe('/lessons', () => {
        const path = "/lessons";
        it('lastDate || lessonsCount', () => {
            chai
                .request(app)
                .post(path)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        "lessonsCount":20,
                        //"teacherIds": [1,4],
                        "title": "rtr",
                        "days": [1,3],
                        "firstDate": "2000-09-12",
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERR_LASTDATE_OR_LESSONS_COUNT");
                    chai.expect(res).to.have.status(400)
                });
        });
        it('title', () => {
            chai
                .request(app)
                .post(path)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        "lessonsCount":20,
                        "teacherIds": [1,4],
                        //"title": "rtr",
                        "days": [1,3],
                        "firstDate": "2000-09-12",
                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_TITLE_MUST_BE_STRING");
                    chai.expect(res).to.have.status(400)
                });
        });

        it('days', () => {
            chai
                .request(app)
                .post(path)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        "lessonsCount":20,
                        //"teacherIds": [1,4],
                        "title": "rtr",
                        "days": [1,2],
                        "firstDate": "2000-09-12",
                    }
                )
                .end(function(error, res, body) {
                    console.log(res.status,res.body)
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_DAYS_MUST_BE_ARRAY_OF_NUMBERS");
                    chai.expect(res).to.have.status(400)
                });
        });

        it('teacherIds', () => {
            chai
                .request(app)
                .post(path)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        "status":2,
                        "lessonsCount":1,
                        "teacherIds":["po",2],
                        "title": "rtr",
                        "days": [1,3],
                        "firstDate": "2000-09-12"

                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.equal("PLATFORM_ERROR_TEACHERIDS_MUST_BE_ARRAY_OF_NUMBERS");
                    chai.expect(res).to.have.status(400)
                });
        });

        it('нормальный запрос', () => {
            chai
                .request(app)
                .post(path)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(
                    {
                        "status":2,
                        "lessonsCount":1,
                        "teacherIds":[1,2],
                        "title": "rtr",
                        "days": [1,3],
                        "firstDate": "2000-09-12"

                    }
                )
                .end(function(error, res, body) {
                    chai.expect(res.body.err).to.be.undefined;
                    chai.expect(res).to.have.status(200)
                });
        });
    })

})

