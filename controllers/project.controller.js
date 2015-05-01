'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

/**
 * Returns an array with all projects.
 *
 * @param req the request.
 * @param res the response.
 */
exports.list = function (req, res, next) {
    Project.find().sort('project_id')
        .then(function (projects) {
            res.json(projects);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not load all projects');
            next(err);
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
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not create project');
            res.status(400).send({
                error: err
            });
        });
};

/**
 * Adds an user to a project.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.addUserToProject = function (req, res, next) {
    req.log.info(req);
};