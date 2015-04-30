'use strict';

var jwt = require('jsonwebtoken'),
    config = require('../config');

/**
 * Creates a JSON web token for the given user.
 *
 * @param user the user.
 */
exports.createToken = function (user) {
    return jwt.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }, config.jwtSecret, {
        expiresInMinutes: config.jwtExpiryTimeInMinutes
    });
};
