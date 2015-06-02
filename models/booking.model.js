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

/**
 * Activate pagination plugin.
 */
mongoosePages.skip(BookingSchema);

/**
 * Validate that start date must be greater than end date.
 */
BookingSchema.path('start').validate(function (value, done) {
    done(this.start < this.end);
}, 'End date must be greater than start date.');

/**
 * Validate that no overlapping bookings are allowed.
 */
BookingSchema.path('end').validate(function (value, done) {
    if (!this.isModified('start') && !this.isModified('end')) {
        return done(true);
    }

    var query = {
        project: this.project,
        user: this.user,
        start: {'$lt': this.end},
        end: {'$gt': this.start}
    };

    // if this is an update -> exclude the current booking
    if (!this.isNew) {
        query._id = {'$ne': this._id};
    }

    this.model('Booking').count(query, function (err, count) {
        if (err) {
            return done(false);
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

/**
 * Finds a booking by id and returns it with populated user and project.
 *
 * @param bookingId the booking id.
 */
BookingSchema.statics.findByIdPopulated = function (bookingId) {
    return this.findById(bookingId).populate('user', '-password').populate('project');
};

module.exports = mongoose.model('Booking', BookingSchema);