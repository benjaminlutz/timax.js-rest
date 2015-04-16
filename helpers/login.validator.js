'use strict';

var validator = require('node-validator');

var loginValidator = validator.isObject()
    .withRequired('email', validator.isString())
    .withRequired('password', validator.isString());

module.exports = validator.express(loginValidator);
