const query = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("../config/passportConfig");
const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");
const asyncHandler = require("express-async-handler");

exports.indexGet = asyncHandler(async (req, res) => {
    res.render("index");
});

exports.loginGet = asyncHandler(async (req, res) => {
    res.render("login");
});

exports.loginPost = (req, res, next) => {
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

exports.registerGet = asyncHandler(async (req, res) => {
    res.render("register");
});

exports.registerPost = [
    validateNewUser,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("register", {
                errors: errors.array(),
                userData: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await query.registerUser(
            req.body.username,
            hashedPassword
        );

        req.logIn(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/drive");
        });
    }),
];