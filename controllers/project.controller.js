'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

/**
 * Returns an array with all projects.
 *
 * @param req the request.
 * @param res the response.
 */
exports.getAllProjects = function (req, res) {
    Project.find().sort('project_id').then(function (projects) {
        res.json(projects);
    });
};
