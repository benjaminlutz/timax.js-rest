'use strict';

var mustBe = require('../helpers/authorization.helper'),
    bookingController = require('../controllers/booking.controller');

module.exports = function (app) {

    /**
     * Create booking.
     */
    app.route('/booking').post(mustBe.atLeastUser, bookingController.create);

    /**
     * Read a booking.
     */
    app.route('/booking/:bookingId').get(mustBe.userOrAdmin, bookingController.hasAuthorization, bookingController.read);

    /**
     * Updates a booking.
     */
    app.route('/booking/:bookingId').put(mustBe.userOrAdmin, bookingController.hasAuthorization, bookingController.update);

    /**
     * Deletes a booking.
     */
    app.route('/booking/:bookingId').delete(mustBe.userOrAdmin, bookingController.hasAuthorization, bookingController.delete);

    /**
     * List all bookings.
     */
    app.route('/booking').get(mustBe.atLeastUser, bookingController.list);

    /**
     * Param middleware to load a booking by id.
     */
    app.param('bookingId', bookingController.loadBookingByID);
};
