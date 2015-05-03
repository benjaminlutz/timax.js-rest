'use strict';

var identityproviderController = require('../controllers/identityprovider.controller');

module.exports = function (app) {

    /**
     * Logon and create token.
     */
    app.route('/identityprovider').post(identityproviderController.logon);
};
