'use strict';

var mustBe = require('../helpers/authorization.helper'),
    bookingController = require('../controllers/booking.controller');

module.exports = function (app) {

    /**
     * GET /booking
     */
    app.route('/booking').get(mustBe.atLeastUser, bookingController.getDummyText);
};
