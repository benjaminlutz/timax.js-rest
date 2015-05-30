'use strict';

var mongoose = require('mongoose'),
    Booking = mongoose.model('Booking'),
    _ = require('lodash');

/**
 * Creates a new Booking.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.create = function (req, res, next) {
    var booking = new Booking(req.body);

    booking.user = req.principal._id;

    booking.saveAsync()
        .spread(function (savedBooking) {
            req.mubsub.publish('bookings', savedBooking);
            res.json(savedBooking);
        })
        .catch(function (err) {
            err.message = 'Could not create booking';
            err.status = 400;
            next(err);
        });
};

/**
 * Shows the current booking.
 *
 * @param req the request.
 * @param res the response.
 */
exports.read = function (req, res) {
    res.json(req.booking);
};

/**
 * Updates a booking.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.update = function (req, res, next) {
    var booking = req.booking;

    booking = _.extend(booking, req.body);

    booking.saveAsync()
        .spread(function (savedBooking) {
            res.json(savedBooking);
        })
        .catch(function (err) {
            err.message = 'Could not update booking';
            err.status = 400;
            next(err);
        });
};

/**
 * Deletes a booking.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.delete = function (req, res, next) {
    var booking = req.booking;

    booking.removeAsync()
        .then(function () {
            res.json(booking);
        })
        .catch(function (err) {
            err.message = 'Could not delete booking';
            err.status = 400;
            next(err);
        });
};

/**
 * Returns an array with all bookings.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.list = function (req, res, next) {
    var page = req.query.page,
        projectId = req.query.project,
        queryObject = {};

    if (req.principal.role === 'user') {
        queryObject.user = req.principal._id;
    }

    if (projectId !== undefined && projectId !== '') {
        queryObject.project = projectId;
    }

    Booking.findAllPaginated(page, queryObject)
        .then(function (bookings) {
            res.json(bookings);
        })
        .catch(function (err) {
            err.message('Could not list all bookings');
            next(err);
        });
};

/**
 * Booking middleware to load a booking by id.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 * @param id the booking id.
 */
exports.loadBookingByID = function (req, res, next, id) {
    var errorMessage = 'Failed to load booking by id: ' + id;

    Booking.findById(id).populate('user', '-password').populate('project')
        .then(function (booking) {
            if (booking) {
                req.booking = booking;
                next();
            } else {
                next(new Error(errorMessage));
            }
        })
        .catch(function (err) {
            req.log.error(errorMessage);
            next(err);
        });
};

/**
 * Booking authorization middleware.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.principal.role === 'user' && !req.booking.user._id.equals(req.principal._id)) {
        res.status(403).json({
            error: {
                message: 'Not Authorized to access booking.'
            }
        });
    } else {
        next();
    }
};