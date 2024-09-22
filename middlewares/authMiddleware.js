const query = require("../db/queries");
const asyncHandler = require("express-async-handler");

exports.authorizeUser = asyncHandler(async (req, res, next) => {
    // Redirect user if they aren't logged in
    if (!req.user) {
        return driveController.unauthorizedGet(req, res);
    }
    next();
});
