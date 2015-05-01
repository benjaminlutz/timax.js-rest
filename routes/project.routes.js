'use strict';

var mustBe = require('../helpers/authorization.helper'),
    projectController = require('../controllers/project.controller');

module.exports = function (app) {

    /**
     * List all projects.
     *
     * GET /project
     */
    app.route('/project').get(mustBe.atLeastManager, projectController.list);

    /**
     * Create project.
     *
     * POST /project
     */
    app.route('/project').post(mustBe.atLeastManager, projectController.create);

    /**
     * Add user to project.
     *
     * POST /project/:projectId/user
     */
    app.route('/project/:projectId/user').post(mustBe.atLeastManager, projectController.addUserToProject);
};
