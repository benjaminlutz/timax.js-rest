'use strict';

var _ = require('lodash'),
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
    mubsub: 'mongodb://localhost:27017/mubsub',
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
var dev_config = {};

/**
 * Environment specific configuration for test environment.
 */
var test_config = {
    mongoDB: 'mongodb://localhost/timaxjs-test',
    mubsub: 'mongodb://localhost:27017/mubsub-test'
};

/**
 * Environment specific configuration for prod environment.
 */
var prod_config = {};

/**
 * Build the config object.
 */
var config = {
    dev: _.extend({}, global_config, dev_config),
    test: _.extend({}, global_config, test_config),
    prod: _.extend({}, global_config, prod_config)
};

/**
 * Return the config for the current environment.
 */
module.exports = config[environment];