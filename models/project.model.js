'use strict';

var Q = require('bluebird'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    mongoosePages = require('mongoose-pages');

var ProjectSchema = new Schema({
    project_id: {
        type: String,
        trim: true,
        required: true,
        match: /^P00[0-9]{3}/,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoosePages.skip(ProjectSchema);

/**
 * Finds all Projects and return them in a paginated way.
 *
 * @param page the page to return.
 * @returns {*} a promise.
 */
ProjectSchema.statics.findAllPaginated = function (page) {
    var me = this;

    return new Q(function (resolve, reject) {
        me.findPaginated({}, null, {sort: {'project_id': 'ascending'}}, function (err, result) {
            if (err) {
                reject(err);
            }

            resolve(result);
        }, 10, page);
    });
};

module.exports = mongoose.model('Project', ProjectSchema);