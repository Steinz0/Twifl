const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API Messsages", () => {
  mocha.it("user_login", (done) => {
    const request = chai.request(app.default).keepOpen();
    const user = {
        login: "Steinz",
        password: "Santhos_20",
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

  mocha.it("recup all msg", (done) => {
    const request = chai.request(app.default).keepOpen();

    request
        .get('/api/message/recupMsg')

        .then((res) => {
            res.should.have.status(200);
        }).then(() => done(), (err) => done(err))
        .finally(() => {
            request.close()
        })
    })  

    mocha.it("recup all msg Steinz", (done) => {
        const request = chai.request(app.default).keepOpen();
    
        request
            .get('/api/message/recupMsg/Steinz')
    
            .then((res) => {
                res.should.have.status(200);
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
    })  
})