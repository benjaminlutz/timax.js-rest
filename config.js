var config = {};

config.environment = 'dev';

config.port = 3000;

config.jwtSecret = 'pL3aS3_ChAnG3_M3!';
config.jwtExpiryTimeInMinutes = 600;

config.mongoDB = 'mongodb://localhost/timaxjs';

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