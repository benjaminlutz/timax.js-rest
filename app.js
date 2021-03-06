'use strict';

// require('newrelic');

var Q = require('bluebird'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    bunyan = require('bunyan'),
    config = require('./config'),
    jwt = require('express-jwt'),
    mongoose = require('mongoose'),
    mubsub = require('mubsub');

// global promisify
Q.promisifyAll(mongoose);

// create logger
var log = bunyan.createLogger(config.logger);

// bootstrap db connection
mongoose.connect(config.mongoDB, function (err) {
    if (err) {
        log.error(err, 'Could not connect to MongoDB!');
    } else {
        log.info('Connected to MongoDB: ' + config.mongoDB);
    }
});

// load all mongoose models
fs.readdirSync(path.join(__dirname, 'models')).forEach(function (file) {
    require('./models/' + file);
});

// init mubsub client
var mubsubclient = mubsub(config.mubsub);
mubsubclient.on('connect', function () {
    log.info('Connected mubsub client to: ' + config.mubsub);
});
mubsubclient.on('error', function (err) {
    log.error(err, 'Could not connect mubsub client!');
});
var channel = mubsubclient.channel('bookings');
channel.on('error', function (err) {
    log.error(err, 'Error on channel bookings.');
});

// init express
var app = express();

// configure logger
app.use(require('express-bunyan-logger')(config.logger));

// configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// configure CORS
app.use(cors());

// configure JSON Web Token (JWT) middleware
app.use(jwt({
    secret: config.jwtSecret,
    userProperty: 'principal'
}).unless({
    path: ['/identityprovider', '/']
}));

// configure JSON Web Token (JWT) middleware error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: {
                message: err.message,
                error: err
            }
        });
    }
});

// make mubsub channel accessible
app.use(function(req, res, next) {
    req.mubsub = channel;
    next();
});

// serve static content
app.use(express.static(__dirname + '/static'));

// load routes and controllers
fs.readdirSync(path.join(__dirname, 'routes')).forEach(function (file) {
    require('./routes/' + file)(app);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// configure development error handler (will print stacktrace)
if (config.environment === 'dev') {
    app.use(function (err, req, res, next) {
        log.error(err);
        res.status(err.status || 500);
        res.json({
            error: {
                message: err.message,
                error: err
            }
        });
    });
}

// configure production error handler (no stacktraces leaked to user)
app.use(function (err, req, res, next) {
    log.error(err);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// start server
var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    log.info('timax.js REST server listening at http://%s:%s', host, port);
});

// expose app
module.exports = app;