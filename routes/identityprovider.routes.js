'use strict';

var identityproviderController = require('../controllers/identityprovider.controller');

module.exports = function (app) {

    /**
     * POST /identityprovider
     */
    app.route('/identityprovider').post(identityproviderController.logon);
};
