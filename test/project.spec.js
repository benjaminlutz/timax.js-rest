'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    testUtil = require('./test.utils');

describe('Project resource', function () {

    describe('GET /project', function () {
        it('should return an array with all projects', function (done) {
            agent.get('/project')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    expect(response.body).toEqual({project: 'Hans'});
                    done();
                });
        });
    });
});
