'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    testUtil = require('./test.utils'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User');

var project, user;

describe('Project resource', function () {

    beforeEach(function (done) {
        user = new User({
            firstName: 'Thorsten',
            lastName: 'Tester',
            email: 'test@test.com',
            password: '12test'
        });

        project = new Project({
            project_id: 'PR123',
            description: 'The test project'
        });

        user.save(function (err, savedUser) {
            user = savedUser;
            project.save(function (err, savedProject) {
                project = savedProject;
                done();
            });
        });
    });

    afterEach(function (done) {
        Project.remove().exec();
        User.remove().exec();
        done();
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
                .end(function (err) {
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
                    expect(response.body.error.message).toEqual('Could not create project');
                    done();
                });
        });
    });

    describe('GET /project/:projectId', function () {
        it('should return the project with the given id', function (done) {
            agent.get('/project/' + project._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    expect(response.body.project_id).toEqual('PR123');
                    expect(response.body.description).toEqual('The test project');
                    done();
                });
        });
    });

    describe('PUT /project/:projectId', function () {
        it('should update the project', function (done) {
            agent.put('/project/' + project._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('admin'))
                .send({
                    project_id: 'PR77',
                    description: 'my super test project'
                })
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Project.findOne().then(function (updatedProject) {
                        expect(updatedProject.project_id).toEqual('PR77');
                        expect(updatedProject.description).toEqual('my super test project');
                        done();
                    });
                });
        });
    });

    describe('DELETE /project/:projectId', function () {
        it('should delete the project', function (done) {
            agent.delete('/project/' + project._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('admin'))
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Project.find().then(function (projects) {
                        expect(projects.length).toBe(0);
                        done();
                    });
                });
        });
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

    describe('POST /project/:projectId/user', function () {
        it('should add a user to the project', function (done) {
            expect(project.users.length).toBe(0);
            agent.post('/project/' + project._id + '/user')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .send({
                    userId: user._id
                })
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Project.findOne().then(function (updatedProject) {
                        expect(updatedProject.users.length).toBe(1);
                        done();
                    });
                });
        });
    });

    describe('DELETE /project/:projectId/user', function () {
        it('should remove a user from the project', function (done) {
            project.users.push(user._id);
            project.save(function (err, savedProject) {
                project = savedProject;
                expect(project.users.length).toBe(1);

                agent.delete('/project/' + project._id + '/user')
                    .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                    .send({
                        userId: user._id
                    })
                    .expect(200)
                    .end(function (err) {
                        expect(err).toBeNull();

                        Project.findOne().then(function (updatedProject) {
                            expect(updatedProject.users.length).toBe(0);
                            done();
                        });
                    });
            });
        });
    });
});
