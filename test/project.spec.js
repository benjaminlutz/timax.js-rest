'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    testUtil = require('./test.utils'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project');

var project;

describe('Project resource', function () {

    beforeEach(function (done) {
        project = new Project({
            project_id: 'PR123',
            description: 'The test project'
        });

        project.save(function () {
            done();
        });
    });

    afterEach(function (done) {
        Project.remove().exec();
        done();
    });

    describe('GET /project', function () {
        it('should return an array with all projects', function (done) {
            agent.get('/project')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    var project = response.body[0];
                    expect(project.project_id).toEqual('PR123');
                    expect(project.description).toEqual('The test project');
                    done();
                });
        });
    });
});
