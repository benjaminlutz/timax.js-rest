'use strict';

/**
 * Adds a dummy text JSON object to the response.
 *
 * @param req the request.
 * @param res the response.
 */
exports.getDummyText = function (req, res) {
    res.json({
        hello: 'world'
    });
};
