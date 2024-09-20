const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");
const asyncHandler = require("express-async-handler");

const driveGet = asyncHandler(async (req, res) => {
    res.render("drive");
});

const unauthorizedGet = asyncHandler(async (req, res) => {
    res.render("unauthorized");
});

// Rest of routes

module.exports = {
    unauthorizedGet,
    driveGet,
};
