'use strict';

var identityproviderController = require('../controllers/identityprovider.controller');

module.exports = function (app) {

    /**
     * Logon and create token.
     *
     * POST /identityprovider
     */
    app.route('/identityprovider').post(identityproviderController.logon);
};
