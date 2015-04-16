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
    var token = jwt.sign({ name: 'Hans Wurst' }, conf.secret, { expiresInMinutes: 60 * 5 });

    res.send(token);
};
