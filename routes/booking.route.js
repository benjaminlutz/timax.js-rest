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
    app.route('/booking/:bookingId').get(mustBe.atLeastUser, bookingController.read);

    /**
     * Updates a booking.
     */
    app.route('/booking/:bookingId').put(mustBe.atLeastUser, bookingController.update);

    /**
     * Deletes a booking.
     */
    app.route('/booking/:bookingId').delete(mustBe.atLeastUser, bookingController.delete);

    /**
     * List all bookings.
     */
    app.route('/booking').get(mustBe.atLeastUser, bookingController.list);

    /**
     * Param middleware to load a booking by id.
     */
    app.param('bookingId', bookingController.loadBookingByID);
};
