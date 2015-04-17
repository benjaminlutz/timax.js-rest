'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
    logger = require('morgan'),
    conf = require('./config.json'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(conf.mongoDB, function (err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

// load all mongoose models
fs.readdirSync(path.join(__dirname, 'models')).forEach(function (file) {
    require('./models/' + file);
});

// init express
var app = express();

// configure request logger
app.use(logger(conf.environment));

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
if (conf.environment === 'dev') {
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
var server = app.listen(conf.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log(chalk.green('timax.js REST server listening at http://%s:%s', host, port));
});
