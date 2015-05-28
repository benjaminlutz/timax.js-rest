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
 * Validation of start and end of bookings.
 */
BookingSchema.path('end').validate(function (value, done) {
    if (!this.isModified('start') || !this.isModified('end')) {
        done();
    }

    // end date must be greater than start date
    if (this.start > this.end) {
        var err = new Error('End date must be greater than start date.');
        done(err);
    }

    // overlapping bookings are not allowed
    this.model('Booking').count({
        project: this.project,
        user: this.user,
        start: {'$lt': this.end},
        end: {'$gt': this.start}
    }, function (err, count) {
        if (err) {
            return done(err);
        }
        // if count is greater than zero -> invalidate
        done(!count);
    });
}, 'Overlapping bookings are not allowed.');

/**
 * Finds all Bookings and return them in a paginated way.
 *
 * @param page the page to return.
 * @param queryObject the query object.
 * @returns {*} a promise.
 */
BookingSchema.statics.findAllPaginated = function (page, queryObject) {
    var me = this;

    return new Q(function (resolve, reject) {
        me.findPaginated(queryObject, null, {sort: {'start': 'descending'}}, function (err, result) {
            if (err) {
                reject(err);
            }

            resolve(result);
        }, 10, page).populate('user', '-password').populate('project');
    });
};

module.exports = mongoose.model('Booking', BookingSchema);