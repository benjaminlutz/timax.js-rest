'use strict';

var mustBe = require('../helpers/authorization.helper'),
    projectController = require('../controllers/project.controller');

module.exports = function (app) {

    /**
     * Create project.
     *
     * POST /project
     */
    app.route('/project').post(mustBe.admin, projectController.create);

    /**
     * Read a project.
     *
     * GET /project/:projectId
     */
    app.route('/project/:projectId').get(mustBe.atLeastManager, projectController.read);

    /**
     * Updates a project.
     *
     * PUT /project/:projectId
     */
    app.route('/project/:projectId').put(mustBe.admin, projectController.update);

    /**
     * Deletes a project.
     *
     * GET /project/:projectId
     */
    app.route('/project/:projectId').delete(mustBe.admin, projectController.delete);

    /**
     * List all projects.
     *
     * GET /project
     */
    app.route('/project').get(mustBe.atLeastManager, projectController.list);

    /**
     * Add user to project.
     *
     * POST /project/:projectId/user
     */
    app.route('/project/:projectId/user').post(mustBe.atLeastManager, projectController.addUserToProject);

    /**
     * Removes user from project.
     *
     * DELETE /project/:projectId/user
     */
    app.route('/project/:projectId/user').delete(mustBe.atLeastManager, projectController.removeUserFromProject);

    /**
     * Param middleware to load a Project by Id.
     */
    app.param('projectId', projectController.loadProjectByID);
};
