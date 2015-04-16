'use strict';

var express = require('express'),
    app = express(),
    conf = require('./config.json');

// serve static content
app.use(express.static(__dirname + '/static'));

// load routes and controllers
var normalizedPath = require('path').join(__dirname, 'routes');

require('fs').readdirSync(normalizedPath).forEach(function (file) {
    require('./routes/' + file)(app);
});

var server = app.listen(conf.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('timax.js REST server listening at http://%s:%s', host, port);
});
