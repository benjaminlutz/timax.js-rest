'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

/**
 * Returns an array with all projects.
 *
 * @param req the request.
 * @param res the response.
 */
exports.list = function (req, res) {
    Project.find().sort('project_id')
        .then(function (projects) {
            res.json(projects);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not load all projects');
            res.sendStatus(400);
        });
};

/**
 * Creates a new project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.create = function (req, res) {
    var project = new Project(req.body);

    project.saveAsync()
        .spread(function (savedProject, numAffected) {
            res.json(savedProject);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not create project');
            res.status(400).send({
                error: err
            });
        });
};