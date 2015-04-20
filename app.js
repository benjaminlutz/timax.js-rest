'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    bunyan = require('bunyan'),
    config = require('./config'),
    mongoose = require('mongoose');

// create logger
var log = bunyan.createLogger(config.logger);

// Bootstrap db connection
var db = mongoose.connect(config.mongoDB, function (err) {
    if (err) {
        log.info(err, 'Could not connect to MongoDB!');
    }
});

// load all mongoose models
fs.readdirSync(path.join(__dirname, 'models')).forEach(function (file) {
    require('./models/' + file);
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

// configure CORS header
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type, Authorization');
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
