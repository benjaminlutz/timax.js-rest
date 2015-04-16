'use strict';

var identityproviderController = require('../controllers/identityprovider.controller'),
    loginValidator = require('../helpers/login.validator');

module.exports = function (app) {
    app.route('/idp').post([loginValidator, identityproviderController.login]);
};
