const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    res.render("index");
};

module.exports = {
    indexGet,
};
