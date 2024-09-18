const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    res.render("index");
};

const loginGet = async (req, res) => {
    res.render("login");
};

const registerGet = async (req, res) => {
    res.render("register");
};

module.exports = {
    indexGet,
    loginGet,
    registerGet,
};
