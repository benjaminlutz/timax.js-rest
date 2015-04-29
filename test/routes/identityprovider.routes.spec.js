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
                    expect(err).toBeNull();

                    // the JWT is always different...
                    expect(response.text).toBeDefined();
                    done();
                });
        });

        it('should NOT be possible to logon with correct e-mail but wrong password', function (done) {
            agent.post('/idp')
                .send({
                    email: 'test@test.com',
                    password: '12test456'
                })
                .expect(401)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.text).toBe('Unauthorized');
                    done();
                });
        });

        it('should NOT be possible to logon with wrong e-mail but correct password', function (done) {
            agent.post('/idp')
                .send({
                    email: 'test123@test.com',
                    password: '12test'
                })
                .expect(401)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.text).toBe('Unauthorized');
                    done();
                });
        });
    });
});
