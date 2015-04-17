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

    User.findByEMail(email, function (err, user) {
        if (err) {
            return res.sendStatus(401);
        } else {
            console.log(user);

            if (user) {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        return res.sendStatus(401);
                    } else {
                        if (isMatch) {
                            var token = jwt.sign({
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }, conf.jwtSecret, {
                                expiresInMinutes: conf.jwtExpiryTimeInMinutes
                            });

                            res.send(token);
                        } else {
                            return res.sendStatus(401);
                        }
                    }
                });
            } else {
                return res.sendStatus(401);
            }
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
