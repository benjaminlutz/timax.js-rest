'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash');

/**
 * Creates a new project.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.create = function (req, res, next) {
    var project = new Project(req.body);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            err.message = 'Could not create project';
            err.status = 400;
            next(err);
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
 * @param next the next callback.
 */
exports.update = function (req, res, next) {
    var project = req.project;

    project = _.extend(project, req.body);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            err.message = 'Could not update project';
            err.status = 400;
            next(err);
        });
};

/**
 * Deletes a project.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.delete = function (req, res, next) {
    var project = req.project;

    project.removeAsync()
        .then(function () {
            res.json(project);
        })
        .catch(function (err) {
            err.message = 'Could not delete project';
            err.status = 400;
            next(err);
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
    var page = req.query.page;

    Project.findAllPaginated(page)
        .then(function (projects) {
            res.json(projects);
        })
        .catch(function (err) {
            err.message('Could not list all projects');
            next(err);
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
    var userId = req.body.userId,
        project = req.project;

    project.users.addToSet(userId);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            err.message = 'Could not add user to project';
            err.status = 400;
            next(err);
        });
};

/**
 * Removes an user from the project.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.removeUserFromProject = function (req, res, next) {
    var userId = req.params.userId,
        project = req.project;

    project.users.pull(userId);

    project.saveAsync()
        .spread(function (savedProject) {
            res.json(savedProject);
        })
        .catch(function (err) {
            err.message = 'Could not remove user from project';
            err.status = 400;
            next(err);
        });
};

/**
 * Project middleware to load a project by id.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 * @param id the project id.
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