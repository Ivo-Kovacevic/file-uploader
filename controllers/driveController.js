const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

exports.unauthorizedGet = asyncHandler(async (req, res) => {
    return res.render("unauthorized");
});

exports.invalidGet = asyncHandler(async (req, res) => {
    return res.render("invalid", {
        currentUrl: req.originalUrl,
    });
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
    if (req.currentFolder === null) {
        return res.render("invalid", {
            currentUrl: req.originalUrl,
        });
    }
    return res.render("drive", {
        currentUrl: req.originalUrl,
        currentFolder: req.currentFolder,
        pathArray: req.pathArray,
    });
});

exports.createFolderPost = [
    validateNewFolder,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("drive", {
                errors: errors.array(),
                folderName: req.body,
                currentUrl: req.originalUrl,
                currentFolder: req.currentFolder,
            });
        }

        const newFolderName = req.body.newFolder;
        const userId = req.user.id;
        const parentFolderId = req.currentFolder.id;
        const url = req.pathArray.join("/");

        await query.createNewFolder(newFolderName, userId, parentFolderId);
        return res.redirect(`/${url}`);
    }),
];

exports.uploadFilePost = [
    upload.single("newFile"),
    asyncHandler(async (req, res, next) => {
        return res.redirect("/drive");
    }),
];
