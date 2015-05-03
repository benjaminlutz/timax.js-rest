'use strict';

var jwtHelper = require('../helpers/jwt.helper');

exports.createTokenAndAuthHeaderFor = function (role) {
    var user = {
            email: 'hans.wurst@cma.com',
            firstName: 'Hans',
            lastName: 'Wurst',
            role: role
        },
        token = jwtHelper.createToken(user);

    return 'Bearer ' + token;
};
