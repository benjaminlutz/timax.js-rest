'use strict';

var mustBe = require('../helpers/authorization.helper'),
    userController = require('../controllers/user.controller');

module.exports = function (app) {

    /**
     * Searches for user.
     */
    app.route('/user/search').get(mustBe.atLeastManager, userController.search);
};
