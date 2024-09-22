const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");
const { currentFolderData } = require("../middlewares/currentFolderMiddleware");

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
    });
});

exports.createFolderPost = [
    validateNewFolder,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const pathArray = req.originalUrl
            .split("/")
            .filter((item) => item !== "");

        // Remove "/create-folder" from url
        pathArray.pop();

        const url = pathArray.join("/");

        // Redirect if folder validation fails
        if (!errors.isEmpty()) {
            req.flash("errors", errors.array());
            req.flash("folderName", req.body);
            req.flash("currentUrl", req.originalUrl);
            return res.redirect(`/${url}`);
        }

        // Create new folder if validation passes
        const newFolderName = req.body.newFolder;
        const userId = req.user.id;
        const parentFolderId = req.currentFolder.id;
        const newFolder = await query.createNewFolder(
            newFolderName,
            userId,
            parentFolderId
        );
        if (newFolder === "Folder name already exists") {
            req.flash("error", "Folder name already exists");
        }

        // Redirect to driveGet
        return res.redirect(`/${url}`);
    }),
];

exports.deleteFolderGet = asyncHandler(async (req, res) => {
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    // Remove "/delete-folder" from url
    pathArray.pop();

    const folderId = decodeURIComponent(req.params.id);
    await query.deleteFolder(folderId);

    // Remove folderId from the url
    pathArray.pop();
    const url = pathArray.join("/");

    // Redirect to driveGet
    return res.redirect(`/${url}`);
});

exports.uploadFilePost = [
    upload.single("newFile"),
    asyncHandler(async (req, res, next) => {
        return res.redirect("/drive");
    }),
];
