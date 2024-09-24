const fs = require("fs");
const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");
const { render } = require("ejs");
const { log } = require("console");
// const cloudinary = require("../config/cloudinaryConfig");

exports.unauthorizedGet = asyncHandler(async (req, res) => {
    return res.render("unauthorized");
});

exports.invalidGet = asyncHandler(async (req, res) => {
    return res.render("invalid");
});

exports.logoutGet = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect("/");
    });
});

exports.driveGet = asyncHandler(async (req, res) => {
    // Render invalid page folder doesnt exist
    if (req.currentFolder === null) {
        return res.render("invalid");
    }
    return res.render("drive", {
        currentFolder: req.currentFolder,
        pathArray: req.pathArray,
        folderExists: req.flash("folderExists"),
    });
});
