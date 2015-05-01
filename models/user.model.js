'use strict';

var P = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        }
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
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: ['user']
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
 * Middleware, which will be called before the model will be saved.
 *
 * If the password field was changed, it will create a hash of it.
 */
UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Compares the given clear text password with the hashed password of the model.
 *
 * @param candidatePassword the clear text password.
 * @returns {*} a promise.
 */
UserSchema.methods.comparePassword = function (candidatePassword) {
    var me = this;

    return new P(function (resolve, reject) {
        bcrypt.compare(candidatePassword, me.password, function (err, isMatch) {
            if (err || isMatch === false) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

/**
 * Tries to find an user by his e-mail address (case insensitive!).
 *
 * @param email the e-mail address.
 * @returns {*} a promise.
 */
UserSchema.statics.findByEMail = function (email) {
    var me = this;

    return new P(function (resolve, reject) {
        me.findOne({'email': {$regex: new RegExp('^' + email.toLowerCase(), 'i')}}, function (err, user) {
            if (err || user === undefined) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
};

module.exports = mongoose.model('User', UserSchema);