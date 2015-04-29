'use strict';

var request = require('supertest'),
    app = require('../../app'),
    agent = request.agent(app);

describe('BookingRoute', function () {

    describe('Booking dummy route', function () {
        it('should return a dummy text', function (done) {
            agent.get('/booking')
                .expect(200)
                .end(function (err, response) {
                    expect(response.body).toEqual({hello: 'world'});
                    done();
                });
        });
    });
});
