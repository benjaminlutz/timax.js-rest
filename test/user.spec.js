'use strict';

var request = require('supertest'),
    app = require('../app'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    testUtil = require('./test.util'),
    agent = request.agent(app);

var user, project;

describe('User resource', function () {

    beforeEach(function (done) {
        user = new User({
            firstName: 'Thorsten',
            lastName: 'Tester',
            email: 'test@test.com',
            password: '12test'
        });

        project = new Project({
            project_id: 'P00123',
            description: 'The test project'
        });

        user.save(function (err, savedUser) {
            user = savedUser;
            project.users.push(savedUser);
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

    describe('GET /user/search?q=<search string>', function () {
        it('should be possible to search with the first name', function (done) {
            agent.get('/user/search?q=thorsten')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.body.length).toBe(1);
                    expect(response.body[0].email).toEqual('test@test.com');
                    done();
                });
        });

        it('should be possible to search with the last name', function (done) {
            agent.get('/user/search?q=tester')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.body.length).toBe(1);
                    expect(response.body[0].email).toEqual('test@test.com');
                    done();
                });
        });

        it('should be possible to search with the e-mail address', function (done) {
            agent.get('/user/search?q=test@test.com')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.body.length).toBe(1);
                    expect(response.body[0].email).toEqual('test@test.com');
                    done();
                });
        });
    });

    describe('GET /user/:userId/project', function () {
        it('should return all projects for the given user', function (done) {
            agent.get('/user/' + user._id + '/project')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user.email))
                .expect(200)
                .end(function (err, response) {
                    expect(err).toBeNull();
                    expect(response.body.length).toBe(1);
                    done();
                });
        });
    });
});
