'use strict';

var request = require('supertest'),
    app = require('../../app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    agent = request.agent(app);

var user;

describe('Identityprovider Route', function () {

    beforeEach(function (done) {
        user = new User({
            firstName: 'Thorsten',
            lastName: 'Tester',
            email: 'test@test.com',
            password: '12test'
        });

        user.save(function () {
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec();
        done();
    });

    describe('POST /idp', function () {
        it('should be possible to logon and to create a valid token', function (done) {
            agent.post('/idp')
                .send({
                    email: 'test@test.com',
                    password: '12test'
                })
                .expect(200)
                .end(function (err, response) {
                    // the JWT is always different...
                    expect(response.text.length).toBeGreaterThan(10);
                    done();
                });
        });
    });
});
