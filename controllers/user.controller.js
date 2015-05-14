'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
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
        .then(function (users) {
            res.json(users);
        })
        .catch(function (err) {
            err.message('Could not search for user');
            next(err);
        });
};
