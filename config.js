var config = {};

/**
 * Defines the environment or stage in which the application runs.
 *
 * @type {string} dev or production.
 */
config.environment =  process.env.NODE_ENV || 'dev';

/**
 * The port on which the server will listen.
 *
 * @type {number} as the easiest choice, take a port number > 1024.
 */
config.port = process.env.PORT || 3000;

/**
 * The secret which will be used for the hashing of the JSON Web Token.
 *
 * Please change it before you start the application for the first time!
 *
 * @type {string} the secret.
 */
config.jwtSecret = 'pL3aS3_ChAnG3_M3!';

/**
 * The expiry time of the JSON Web Token in minutes.
 *
 * @type {number} the expiry time in minutes.
 */
config.jwtExpiryTimeInMinutes = 600;

/**
 * The connection string of the mongoDB.
 *
 * See http://docs.mongodb.org/manual/reference/connection-string/ for further information.
 *
 * @type {string} the mongoDB connection string.
 */
config.mongoDB = 'mongodb://localhost/timaxjs';

/**
 * The configuration of the logger.
 *
 * See https://github.com/trentm/node-bunyan/blob/master/README.md for further information.
 *
 * @type {{name: string, streams: *[]}} logger config object.
 */
config.logger = {
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
};

module.exports = config;