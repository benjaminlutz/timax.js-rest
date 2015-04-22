'use strict';

var requestMock, responseMock,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchemaMock = new Schema({
    email: String,
    password: String
});

userSchemaMock.statics.authenticate = function (email, password, cb) {
    cb(null, {});
};

mongoose.model('User', userSchemaMock);

var IdentityController = require('../../controllers/identityprovider.controller');

describe('IdentityController', function () {

    beforeEach(function () {
        requestMock = jasmine.createSpyObj('request', ['dummyFunc']);
        responseMock = jasmine.createSpyObj('response', ['send']);
    });

    describe('logon()', function () {
        var request = {
            body: {
                email: 'hans.wurst@google.com',
                password: 'geheim'
            }
        };

        it('can successfully logon and create a new token', function () {
            IdentityController.logon(request, responseMock);
            expect(responseMock.send).toHaveBeenCalled();
        });
    });
});
