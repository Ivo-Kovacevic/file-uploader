const query = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    res.render("index");
};

const loginGet = async (req, res) => {
    res.render("login");
};

const loginPost = async (req, res) => {
    res.render("login");
};

const registerGet = async (req, res) => {
    res.render("register");
};

const registerPost = [
    validateNewUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render("register", {
                    errors: errors.array(),
                    userData: req.body,
                });
            }
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                const newUser = await query.registerUser(
                    req.body.username,
                    hashedPassword
                );
                req.logIn(newUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect("/");
                });
            });
        } catch (err) {
            return next(err);
        }
    },
];

module.exports = {
    indexGet,
    loginGet,
    loginPost,
    registerGet,
    registerPost,
};
