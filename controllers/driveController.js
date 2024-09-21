const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

const unauthorizedGet = asyncHandler(async (req, res) => {
    res.render("unauthorized");
});

const logoutGet = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

const driveGet = asyncHandler(async (req, res) => {
    res.render("drive", {
        currentUrl: req.originalUrl,
        currentFolder: req.currentFolder,
        pathArray: req.pathArray,
    });
});

const createFolderPost = [
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
        req.pathArray.pop();
        const url = req.pathArray.join("/");

        await query.createNewFolder(newFolderName, userId, parentFolderId);
        res.redirect(`/${url}`);
    }),
];

const uploadFilePost = [
    upload.single("newFile"),
    asyncHandler(async (req, res, next) => {
        res.redirect("/drive");
    }),
];

module.exports = {
    unauthorizedGet,
    driveGet,
    createFolderPost,
    uploadFilePost,
    logoutGet,
};
