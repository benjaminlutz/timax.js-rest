'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    _ = require('lodash');

/**
 * Does a full text search over the compound index of the user.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.search = function (req, res, next) {
    var queryString = req.query.q;

    User.find({
            $text: {$search: queryString}
        },
        {
            score: {$meta: 'textScore'}
        })
        .sort(
        {
            score: {$meta: 'textScore'}
        })
        .execAsync()
        .then(function (users) {
            res.json(users);
        })
        .catch(function (err) {
            next(err);
        });
};

/**
 * Returns all projects for the given user.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.listProjectsByUser = function (req, res, next) {
    var user = req.user;

    if ((req.principal.role === 'user') && !req.user._id.equals(req.principal._id)) {
        next(new Error('Not authorized'));
    }

    Project.find({users: user._id})
        .then(function (projects) {
            res.json(projects);
        })
        .catch(function (err) {
            err.message = 'Could not load projects for user';
            err.status = 400;
            next(err);
        });
};

/**
 * User middleware to load a user by id.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 * @param id the user id.
 */
exports.loadUserByID = function (req, res, next, id) {
    var errorMessage = 'Failed to load user by id: ' + id;

    User.findById(id)
        .then(function (user) {
            if (user) {
                req.user = user;
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