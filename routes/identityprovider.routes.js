'use strict';

var identityproviderController = require('../controllers/identityprovider.controller');

module.exports = function (app) {

    app.route('/idp').post(identityproviderController.logon);

    // TODO: delete me later
    app.route('/idp/new').post(identityproviderController.create);
};
