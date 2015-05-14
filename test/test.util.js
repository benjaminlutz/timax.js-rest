'use strict';

var jwtHelper = require('../helpers/jwt.helper');

exports.createTokenAndAuthHeaderFor = function (role, userId) {
    var user = {
            email: 'hans.wurst@cma.com',
            firstName: 'Hans',
            lastName: 'Wurst',
            role: role,
            _id: userId
        },
        token = jwtHelper.createToken(user);

    return 'Bearer ' + token;
};
