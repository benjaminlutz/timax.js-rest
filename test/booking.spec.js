'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    testUtil = require('./test.utils');

describe('BookingRoute', function () {

    describe('Booking dummy route', function () {
        it('should return a dummy text', function (done) {
            agent.get('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .expect(200)
                .end(function (err, response) {
                    expect(response.body).toEqual({hello: 'Hans'});
                    done();
                });
        });
    });
});
