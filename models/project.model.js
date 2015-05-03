'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Project', ProjectSchema);