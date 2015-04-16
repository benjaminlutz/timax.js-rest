'use strict';

var bookingController = require('../controllers/booking.controller');

module.exports = function (app) {
    // Booking Routes
    app.route('/booking')
        .get(bookingController.getDummyText);
};
