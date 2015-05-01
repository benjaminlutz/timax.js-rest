'use strict';

var identityproviderController = require('../controllers/identityprovider.controller');

module.exports = function (app) {

    app.route('/identityprovider').post(identityproviderController.logon);
};
