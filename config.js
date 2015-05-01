'use strict';

var _ = require('lodash');

var config = {},
    environment = process.env.NODE_ENV || 'dev';

/**
 * Global configuration for all environments.
 *
 * Values can be overwritten by environment specific configurations.
 */
var global_config = {
    environment: environment,
    port: 3000,
    mongoDB: 'mongodb://localhost/timaxjs',
    jwtSecret: 'pL3aS3_ChAnG3_M3!',
    jwtExpiryTimeInMinutes: 600,
    logger: {
        name: 'timax.js-rest',
        streams: [
            {
                level: 'info',
                stream: process.stdout
            },
            {
                level: 'error',
                path: 'timax.js-rest-error.log'
            }
        ]
    }
};

/**
 * Environment specific configuration for dev environment.
 */
config.dev = _.extend({}, global_config, {

});

/**
 * Environment specific configuration for test environment.
 */
config.test = _.extend({}, global_config, {
    mongoDB: 'mongodb://localhost/timaxjs-test'
});

/**
 * Environment specific configuration for prod environment.
 */
config.prod = _.extend({}, global_config, {

});

module.exports = config[environment];