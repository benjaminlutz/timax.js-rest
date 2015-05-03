'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash');

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
 * Shows the current project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.read = function (req, res) {
    res.json(req.project);
};

/**
 * Updates a project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.update = function (req, res) {
    var project = req.project;

    project = _.extend(project, req.body);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not update project');
            res.status(400).send({
                error: err
            });
        });
};

/**
 * Deletes a project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.delete = function (req, res) {
    var project = req.project;

    project.removeAsync()
        .then(function () {
            res.json(project);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not delete project');
            res.status(400).send({
                error: err
            });
        });
};

/**
 * Returns an array with all projects.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
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
 * Adds an user to a project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.addUserToProject = function (req, res) {
    var userId = req.body.userId,
        project = req.project;

    project.users.push(userId);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not add user to project');
            res.status(400).send({
                error: err
            });
        });
};

/**
 * Removes an user from the project.
 *
 * @param req the request.
 * @param res the response.
 */
exports.removeUserFromProject = function (req, res) {
    var userId = req.body.userId,
        project = req.project;

    project.users.pull(userId);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            req.log.error(err, 'Could not remove user from project');
            res.status(400).send({
                error: err
            });
        });
};

/**
 * Project middleware to load a project by id.
 */
exports.loadProjectByID = function (req, res, next, id) {
    var errorMessage = 'Failed to load project by id: ' + id;

    Project.findById(id).populate('users')
        .then(function (project) {
            if (project) {
                req.project = project;
                next();
            } else {
                next(new Error(errorMessage));
            }
        })
        .catch(function (err) {
            req.log.error(errorMessage);
            next(err);
        });
};