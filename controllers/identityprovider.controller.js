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
        password = req.body.password,
        errorFunc = function () {
            req.log.warn('Invalid attempt to logon for user: %s', email);
            return res.sendStatus(401);
        };

    User.findByEMail(email)
        .then(function (user) {
            user.comparePassword(password)
                .then(function () {
                    res.send(jwtHelper.createToken(user));
                })
                .catch(errorFunc);
        })
        .catch(errorFunc);
};
