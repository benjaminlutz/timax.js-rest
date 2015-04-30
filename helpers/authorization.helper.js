'use strict';

exports.atLeastUser = function (req, res, next) {
    var role = req.principal.role;

    if (role === 'user' || role === 'manager' || role === 'admin') {
        next();
    } else {
        res.status(403).json({
            error: {
                message: 'Not Authorized!'
            }
        });
    }
};