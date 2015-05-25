'use strict';

var request = require('supertest'),
    app = require('../app'),
    agent = request.agent(app),
    testUtil = require('./test.util'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    Booking = mongoose.model('Booking');

var project1, project2, user1, user2, booking1, booking2;

describe('Booking resource', function () {

    beforeEach(function (done) {
        user1 = new User({
            firstName: 'Thorsten',
            lastName: 'Tester',
            email: 'test@test.com',
            password: '12test'
        });

        user2 = new User({
            firstName: 'Manfred',
            lastName: 'Mock',
            email: 'manfred@mock.com',
            password: '45test'
        });

        project1 = new Project({
            project_id: 'P00123',
            description: 'The test project'
        });

        project2 = new Project({
            project_id: 'P00789',
            description: 'The test project II'
        });

        booking1 = new Booking({
            start: new Date(2015, 5, 24, 8, 30, 0),
            end: new Date(2015, 5, 24, 10, 0, 0),
            description: 'My first booking...'
        });

        booking2 = new Booking({
            start: new Date(2015, 5, 24, 10, 30, 0),
            end: new Date(2015, 5, 24, 11, 0, 0),
            description: 'My second booking...'
        });

        // TODO refactor me
        user1.save(function (err, savedUser1) {
            user1 = savedUser1;
            user2.save(function (err, savedUser2) {
                user2 = savedUser2;
                project1.save(function (err, savedProject1) {
                    project1 = savedProject1;
                    project2.save(function (err, savedProject2) {
                        project2 = savedProject2;
                        booking1.user = user1;
                        booking1.project = project1;
                        booking2.user = user2;
                        booking2.project = project2;
                        booking1.save(function (err, savedBooking1) {
                            booking1 = savedBooking1;
                            booking2.save(function (err, savedBooking2) {
                                booking2 = savedBooking2;
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    afterEach(function (done) {
        Booking.remove().exec();
        Project.remove().exec();
        User.remove().exec();
        done();
    });

    describe('POST /booking', function () {
        it('should create a new booking', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .send({
                    start: new Date(2015, 5, 24, 14, 30, 0),
                    end: new Date(2015, 5, 24, 16, 0, 0),
                    description: 'My third booking...',
                    project: project1._id
                })
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Booking.find().then(function (bookings) {
                        expect(bookings.length).toBe(3);
                        done();
                    });
                });
        });

        it('should not be possible to save a booking without a description', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .send({
                    start: new Date(2015, 5, 25, 14, 30, 0),
                    end: new Date(2015, 5, 25, 16, 0, 0),
                    project: project1._id
                })
                .expect(400)
                .end(function (err) {
                    expect(err).toBeDefined();
                    done();
                });
        });

        it('should not be possible to save a booking with overlapping times at the beginning', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .send({
                    start: new Date(2015, 5, 24, 8, 0, 0),
                    end: new Date(2015, 5, 24, 9, 0, 0),
                    description: 'overlapping booking at the beginning',
                    project: project1._id
                })
                .expect(400)
                .end(function (err, response) {
                    expect(err).toBeDefined();
                    expect(response.body.error.message).toEqual('Overlapping bookings not allowed.');
                    done();
                });
        });

        it('should not be possible to save a booking with overlapping times in the middle', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .send({
                    start: new Date(2015, 5, 24, 9, 0, 0),
                    end: new Date(2015, 5, 24, 9, 30, 0),
                    description: 'overlapping booking in the middle',
                    project: project1._id
                })
                .expect(400)
                .end(function (err, response) {
                    expect(err).toBeDefined();
                    expect(response.body.error.message).toEqual('Overlapping bookings not allowed.');
                    done();
                });
        });

        it('should not be possible to save a booking with overlapping times at the end', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .send({
                    start: new Date(2015, 5, 24, 9, 30, 0),
                    end: new Date(2015, 5, 24, 11, 0, 0),
                    description: 'overlapping booking at the end',
                    project: project1._id
                })
                .expect(400)
                .end(function (err, response) {
                    expect(err).toBeDefined();
                    expect(response.body.error.message).toEqual('Overlapping bookings not allowed.');
                    done();
                });
        });
    });

    describe('GET /booking/:bookingId', function () {
        it('should return the booking with the given id', function (done) {
            agent.get('/booking/' + booking1._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .expect(200)
                .end(function (err, response) {
                    expect(response.body.description).toEqual('My first booking...');
                    done();
                });
        });
    });

    describe('PUT /booking/:bookingId', function () {
        it('should update the booking', function (done) {
            agent.put('/booking/' + booking1._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .send({
                    description: 'My updated booking...'
                })
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Booking.findOne().then(function (updatedBooking) {
                        expect(updatedBooking.description).toEqual('My updated booking...');
                        done();
                    });
                });
        });
    });

    describe('DELETE /booking/:bookingId', function () {
        it('should delete the booking', function (done) {
            agent.delete('/booking/' + booking1._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Booking.find().then(function (bookings) {
                        expect(bookings.length).toBe(1);
                        done();
                    });
                });
        });
    });

    describe('GET /booking?<query string>', function () {
        it('should return an array with all bookings when I send an empty query string and have at least the role manager', function (done) {
            agent.get('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    var bookings = response.body.documents;
                    expect(bookings.length).toBe(2);
                    expect(bookings[0].description).toEqual('My second booking...');
                    expect(bookings[1].description).toEqual('My first booking...');
                    done();
                });
        });

        it('should return an array with all bookings of a project when I send the project id and have at least the role manager', function (done) {
            agent.get('/booking/?project=' + project1._id)
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('manager'))
                .expect(200)
                .end(function (err, response) {
                    var bookings = response.body.documents;
                    expect(bookings.length).toBe(1);
                    expect(bookings[0].description).toEqual('My first booking...');
                    done();
                });
        });

        it('should return an array with all bookings of the current user when I send an empty query string and have the role user', function (done) {
            agent.get('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user', user1._id))
                .expect(200)
                .end(function (err, response) {
                    console.log(err);

                    var bookings = response.body.documents;
                    expect(bookings.length).toBe(1);
                    expect(bookings[0].description).toEqual('My first booking...');
                    done();
                });
        });
    });

});
