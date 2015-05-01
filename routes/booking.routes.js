'use strict';

var mustBe = require('../helpers/authorization.helper'),
    bookingController = require('../controllers/booking.controller');

module.exports = function (app) {

    app.route('/booking').get(mustBe.atLeastUser, bookingController.getDummyText);
};
