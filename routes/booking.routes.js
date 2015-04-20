'use strict';

var bookingController = require('../controllers/booking.controller');

module.exports = function (app) {

    app.route('/booking').get(bookingController.getDummyText);

};
