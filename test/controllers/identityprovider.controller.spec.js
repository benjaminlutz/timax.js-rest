'use strict';

var requestMock, responseMock;

var IdentityController = require('../../controllers/identityprovider.controller');

xdescribe('IdentityController', function () {

    beforeEach(function () {
        requestMock = jasmine.createSpyObj('request', ['dummyFunc']);
        responseMock = jasmine.createSpyObj('response', ['send']);
    });

    xdescribe('logon()', function () {
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
