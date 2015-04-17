'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        default: ''
    },
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Tries to find an user by his e-mail address.
 *
 * @param email the e-mail address.
 * @param cb the callback.
 * @returns {Query|*} the function.
 */
UserSchema.statics.findByEMail = function (email, cb) {
    return this.findOne({email: email}, cb);
};

module.exports = mongoose.model('User', UserSchema);