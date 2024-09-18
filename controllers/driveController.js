const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const driveGet = async (req, res) => {
    res.render("drive");
};

module.exports = {
    driveGet,
};
