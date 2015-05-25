'use strict';

var Q = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePages = require('mongoose-pages');

var BookingSchema = new Schema({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoosePages.skip(BookingSchema);

/**
 * Finds all Bookings and return them in a paginated way.
 *
 * @param page the page to return.
 * @returns {*} a promise.
 */
BookingSchema.statics.findAllPaginated = function (page) {
    var me = this;

    return new Q(function (resolve, reject) {
        me.findPaginated({}, null, {sort: {'start': 'descending'}}, function (err, result) {
            if (err) {
                reject(err);
            }

            resolve(result);
        }, 10, page).populate('user', '-password').populate('project');
    });
};

module.exports = mongoose.model('Booking', BookingSchema);