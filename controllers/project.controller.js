'use strict';

/**
 * Returns an array with all projects.
 *
 * @param req the request.
 * @param res the response.
 */
exports.getAllProjects = function (req, res) {
    res.json({
        project: req.principal.firstName
    });
};
