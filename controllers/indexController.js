const query = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("../config/passportConfig");
const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    res.render("index");
};

const loginGet = async (req, res) => {
    res.render("login");
};

const loginPost = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render("login", {
                messageUsername: info.messageUsername,
                messagePassword: info.messagePassword,
                userData: req.body,
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/drive");
        });
    })(req, res, next);
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
                console.log(newUser);
                req.logIn(newUser, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect("/drive");
                });
            });
        } catch (err) {
            return next(err);
        }
    },
];

const logoutGet = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

const invalidPage = async (req, res) => {
    res.render("invalidPage");
};

module.exports = {
    indexGet,
    loginGet,
    loginPost,
    registerGet,
    registerPost,
    logoutGet,
    invalidPage,
};
