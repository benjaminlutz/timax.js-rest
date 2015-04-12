'use strict';

var express = require('express'),
    router = express.Router();

router.use('/booking', require('./booking'));

module.exports = router;
