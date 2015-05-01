'use strict';

var Q = require('bluebird'),
    config = require('./config'),
    mongoose = require('mongoose');

Q.promisifyAll(mongoose);

var User;

function createNewUser(user) {
    var newUser = new User(user);
    console.log('save user: ' + user.firstName);
    return newUser.save();
}

mongoose.connect(config.mongoDB, function (err) {
    if (err) {
        console.log('Could not connect to MongoDB!');
    } else {
        console.log('Connected to: ' + config.mongoDB);

        require('./models/user.model');

        User = mongoose.model('User');
        createNewUser({
            email: 'admin@test.com',
            firstName: 'Achim',
            lastName: 'Administrator',
            password: 'geheim',
            role: 'admin'
        }).then(createNewUser({
            email: 'manager@test.com',
            firstName: 'Michael',
            lastName: 'Manager',
            password: 'geheim',
            role: 'manager'
        })).then(createNewUser({
            email: 'user@test.com',
            firstName: 'Udo',
            lastName: 'User',
            password: 'geheim',
            role: 'user'
        })).then(function () {
            mongoose.disconnect();
        });
    }
});
