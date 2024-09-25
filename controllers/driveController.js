const asyncHandler = require("express-async-handler");
// const cloudinary = require("../config/cloudinaryConfig");

exports.unauthorizedGet = asyncHandler(async (req, res) => {
    return res.render("unauthorized");
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
    // Render invalid page folder if doesn't exist
    if (req.currentFolder === null) {
        return res.render("invalidFolder");
    }
    return res.render("drive", {
        currentFolder: req.currentFolder,
        pathArray: req.pathArray,
        folderExists: req.flash("folderExists"),
    });
});
