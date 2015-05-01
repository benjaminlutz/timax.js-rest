'use strict';

var mustBe = require('../helpers/authorization.helper'),
    projectController = require('../controllers/project.controller');

module.exports = function (app) {

    /**
     * GET /project
     */
    app.route('/project').get(mustBe.atLeastManager, projectController.list);

    /**
     * POST /project
     */
    app.route('/project').post(mustBe.atLeastManager, projectController.create);
};
