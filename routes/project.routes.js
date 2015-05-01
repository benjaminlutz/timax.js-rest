'use strict';

var mustBe = require('../helpers/authorization.helper'),
    projectController = require('../controllers/project.controller');

module.exports = function (app) {

    app.route('/project').get(mustBe.atLeastManager, projectController.getAllProjects);
};
