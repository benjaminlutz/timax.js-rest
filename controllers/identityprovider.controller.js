'use strict';

var jwt = require('jsonwebtoken'),
    conf = require('../config.json'),
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

    User.authenticate(email, password, function (err, user) {
        if (err) {
            return res.sendStatus(401);
        } else {
            var token = jwt.sign({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }, conf.jwtSecret, {
                expiresInMinutes: conf.jwtExpiryTimeInMinutes
            });

            res.send(token);
        }
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
