'use strict';

var mustBe = require('../helpers/authorization.helper'),
    userController = require('../controllers/user.controller');

module.exports = function (app) {

    /**
     * List all users.
     */
    app.route('/user').get(mustBe.admin, userController.list);
    
    /**
     * Searches for user.
     */
    app.route('/user/search').get(mustBe.atLeastManager, userController.search);

    /**
     * Returns the projects of the given user.
     */
    app.route('/user/:userId/project').get(mustBe.atLeastUser, userController.listProjectsByUser);

    /**
     * Param middleware to load a user by id.
     */
    app.param('userId', userController.loadUserByID);
};
