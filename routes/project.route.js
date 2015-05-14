'use strict';

var mustBe = require('../helpers/authorization.helper'),
    projectController = require('../controllers/project.controller');

module.exports = function (app) {

    /**
     * Create project.
     */
    app.route('/project').post(mustBe.admin, projectController.create);

    /**
     * Read a project.
     */
    app.route('/project/:projectId').get(mustBe.atLeastManager, projectController.read);

    /**
     * Updates a project.
     */
    app.route('/project/:projectId').put(mustBe.admin, projectController.update);

    /**
     * Deletes a project.
     */
    app.route('/project/:projectId').delete(mustBe.admin, projectController.delete);

    /**
     * List all projects.
     */
    app.route('/project').get(mustBe.atLeastManager, projectController.list);

    /**
     * Add user to project.
     */
    app.route('/project/:projectId/user').post(mustBe.atLeastManager, projectController.addUserToProject);

    /**
     * Removes user from project.
     */
    app.route('/project/:projectId/user/:userId').delete(mustBe.atLeastManager, projectController.removeUserFromProject);

    /**
     * Param middleware to load a project by id.
     */
    app.param('projectId', projectController.loadProjectByID);
};
