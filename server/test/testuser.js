const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API user", () => {
    mocha.it("user", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            login: "pikachuer",
            password: "1234#skwooooAAS",
        };

        request
            .post('/api/user/login')
            .send(user)

            .then((res) => {
                res.should.have.status(201);
                console.log(`Login : ${res.body.message}`)
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })

    mocha.it('add follow', (done) => {
        const request = chai.request(app.default).keepOpen();

        request
            .put(`/api/follow`)
            .send({followed: 'Steinz'})

            .then((res) => {
                res.should.have.status(201);
                console.log(`Add follow : ${res.body.msg}`)
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })

    mocha.it('check follow', (done) => {
        const request = chai.request(app.default).keepOpen();

        request
            .get(`/api/follow/exists`)
            .send({follower:'pikachuer', followed: 'Steinz'})

            .then((res) => {
                console.log(`Check follow : ${res.body.msg}`)
                res.should.have.status(200);
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })

    mocha.it('delete follow', (done) => {
        const request = chai.request(app.default).keepOpen();

        request
            .delete(`/api/follow/delete`)
            .send({followed: 'Steinz'})

            .then((res) => {
                res.should.have.status(200);
                console.log(`delete follow : ${res.body.msg}`)
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })

    mocha.it('check follow', (done) => {
        const request = chai.request(app.default).keepOpen();

        request
            .get(`/api/follow/exists`)
            .send({follower:'pikachuer', followed: 'Steinz'})

            .then((res) => {
                console.log(`Check follow : ${res.body.msg}`)
                res.should.have.status(500);
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })
})