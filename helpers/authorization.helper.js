'use strict';

/**
 * Function that will be called if the Authorization is not valid.
 *
 * @param res the response object.
 */
function errorFunc(res) {
    res.status(403).json({
        error: {
            message: 'Not Authorized!'
        }
    });
}

/**
 * Authorization middleware which checks that the user has at least the role user.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.atLeastUser = function (req, res, next) {
    var role = req.principal.role;

    if (role === 'user' || role === 'manager' || role === 'admin') {
        next();
    } else {
        errorFunc(res);
    }
};

/**
 * Authorization middleware which checks that the user has at least the role manager.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.atLeastManager = function (req, res, next) {
    var role = req.principal.role;

    if (role === 'manager' || role === 'admin') {
        next();
    } else {
        errorFunc(res);
    }
};

/**
 * Authorization middleware which checks that the user has the role admin.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.admin = function (req, res, next) {
    var role = req.principal.role;

    if (role === 'admin') {
        next();
    } else {
        errorFunc(res);
    }
};

/**
 * Authorization middleware which checks that the user has the role user or admin.
 *
 * @param req the request.
 * @param res the response.
 * @param next the next callback.
 */
exports.userOrAdmin = function (req, res, next) {
    var role = req.principal.role;

    if (role === 'admin' || role ==='user') {
        next();
    } else {
        errorFunc(res);
    }
};