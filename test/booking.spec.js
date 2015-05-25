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

        project1 = new Project({
            project_id: 'P00123',
            description: 'The test project'
        });

        booking1 = new Booking({
            start: new Date(2015, 5, 24, 8, 30, 0),
            end: new Date(2015, 5, 24, 10, 0, 0),
            description: 'My first booking...'
        });

        user1.save(function (err, savedUser) {
            user1 = savedUser;
            project1.save(function (err, savedProject) {
                project1 = savedProject;
                booking1.user = savedUser;
                booking1.project = savedProject;
                booking1.save(function (err, savedBooking) {
                    booking1 = savedBooking;
                    done();
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
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .send({
                    start: new Date(2015, 5, 24, 14, 30, 0),
                    end: new Date(2015, 5, 24, 16, 0, 0),
                    description: 'My second booking...'
                })
                .expect(200)
                .end(function (err) {
                    expect(err).toBeNull();

                    Booking.find().then(function (bookings) {
                        expect(bookings.length).toBe(2);
                        done();
                    });
                });
        });

        it('should not be possible to save a booking without a description', function (done) {
            agent.post('/booking')
                .set('Authorization', testUtil.createTokenAndAuthHeaderFor('user'))
                .send({
                    start: new Date(2015, 5, 24, 14, 30, 0),
                    end: new Date(2015, 5, 24, 16, 0, 0)
                })
                .expect(401)
                .end(function (err) {
                    expect(err).toBeDefined();
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
                        expect(bookings.length).toBe(0);
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
                    var booking = response.body.documents[0];
                    expect(booking.description).toEqual('My first booking...');
                    done();
                });
        });
    });

});
