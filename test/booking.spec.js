'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    jwtHelper = require('../helpers/jwt.helper');

describe('BookingRoute', function () {

    describe('Booking dummy route', function () {
        it('should return a dummy text', function (done) {
            var user = {
                    email: 'hans.wurst@cma.com',
                    firstName: 'Hans',
                    lastName: 'Wurst',
                    role: 'user'
                },
                token = jwtHelper.createToken(user);

            agent.get('/booking')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end(function (err, response) {
                    expect(response.body).toEqual({hello: 'Hans'});
                    done();
                });
        });
    });
});
