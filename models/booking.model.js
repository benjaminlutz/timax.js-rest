'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    description: {
        type: String,
        trim: true,
        default: ''
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

module.exports = mongoose.model('Booking', BookingSchema);