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
 * @param cb the callback.
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/**
 * Tries to find an user by his e-mail address (case insensitive!).
 *
 * @param email the e-mail address.
 * @param cb the callback.
 * @returns {Query|*} the function.
 */
UserSchema.statics.findByEMail = function (email, cb) {
    return this.findOne({'email': {$regex: new RegExp('^' + email.toLowerCase(), 'i')}}, cb);
};

/**
 * Tries to authenticate the user by given email and password.
 *
 * @param email the e-mail address.
 * @param password the password.
 */
UserSchema.statics.authenticate = function (email, password) {
    var me = this;

    return new P(function (resolve, reject) {
        me.findByEMail(email, function (err, user) {
            if (err || user === null) {
                reject(err);
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (err || isMatch === false) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

module.exports = mongoose.model('User', UserSchema);