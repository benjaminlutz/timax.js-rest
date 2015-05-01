'use strict';

var jwtHelper = require('../helpers/jwt.helper'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Tries to logon the given user and creates a token.
 *
 * @param req the request.
 * @param res the response.
 */
exports.logon = function (req, res) {
    var email = req.body.email,
        password = req.body.password;

    User.authenticate(email, password)
        .then(function (user) {
            res.send(jwtHelper.createToken(user));
        })
        .catch(function (e) {
            req.log.warn('Invalid attempt to logon for user: %s', email);
            return res.sendStatus(401);
        });
};

// TODO delete me later
exports.create = function (req, res) {
    var user = new User(req.body);

    user.save(function (err, user) {
        if (err) {
            return res.sendStatus(500);
        } else {
            res.json(user);
        }
    });
};
