'use strict';

var jwt = require('jsonwebtoken'),
    conf = require('../config.json');

/**
 * Tries to login the given user and creates a token.
 *
 * @param req the request.
 * @param res the response.
 */
exports.login = function (req, res) {
    var email = req.body.email,
        password = req.body.password;

    var user = {
        email: email,
        password: password
    };

    console.log(user);

    var token = jwt.sign(user, conf.jwtSecret, {expiresInMinutes: conf.jwtExpiryTimeInMinutes});

    res.send(token);
};
