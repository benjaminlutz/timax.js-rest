'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    jwtHelper = require('../helpers/jwt.helper');

describe('Project resource', function () {

    describe('GET /project', function () {
        it('should return an array with all projects', function (done) {
            var user = {
                    email: 'hans.wurst@cma.com',
                    firstName: 'Hans',
                    lastName: 'Wurst',
                    role: 'manager'
                },
                token = jwtHelper.createToken(user);

            agent.get('/project')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end(function (err, response) {
                    expect(response.body).toEqual({project: 'Hans'});
                    done();
                });
        });
    });
});
