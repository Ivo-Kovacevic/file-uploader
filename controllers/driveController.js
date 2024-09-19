const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const driveGet = async (req, res) => {
    res.render("drive");
};

const unauthorizedGet = async (req, res) => {
    res.render("unauthorized");
};

module.exports = {
    unauthorizedGet,
    driveGet,
};
