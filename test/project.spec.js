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

    describe('POST /project', function () {
        it('should create a new project', function (done) {
            agent.post('/project')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('admin'))
                .send({
                    project_id: 'PR456',
                    description: 'The test project II'
                })
                .expect(200)
                .end(function (err, response) {
                    expect(err).toBeNull();

                    Project.find().then(function (projects) {
                        expect(projects.length).toBe(2);
                        done();
                    });
                });
        });

        it('should NOT be possible to save an project without project_id', function (done) {
            agent.post('/project')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('admin'))
                .send({
                    description: 'The test project III'
                })
                .expect(400)
                .end(function (err, response) {
                    expect(err).toBeDefined();
                    expect(response.body.error.message).toEqual('Project validation failed');
                    done();
                });
        });
    });
});
