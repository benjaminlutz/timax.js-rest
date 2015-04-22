'use strict';

var requestMock, responseMock,
    BookingController = require('../../controllers/booking.controller');

describe('BookingController', function () {

    beforeEach(function () {
        requestMock = jasmine.createSpyObj('request', ['dummyFunc']);
        responseMock = jasmine.createSpyObj('response', ['json']);
    });

    describe('getDummyText()', function () {
        it('returns a dummy text', function () {
            BookingController.getDummyText(requestMock, responseMock);
            expect(responseMock.json).toHaveBeenCalledWith({hello: 'world'});
        });
    });
});