const fs = require("fs");
const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

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
        const pathArray = req.originalUrl.split("/").filter((item) => item !== "");

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
        const newFolder = await query.createNewFolder(newFolderName, userId, parentFolderId);
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
        const pathArray = req.originalUrl.split("/").filter((item) => item !== "");

        // Remove "/create-folder" from url
        pathArray.pop();
        const url = pathArray.join("/");

        const name = req.file.originalname;
        const hashedName = req.file.filename;
        const path = req.file.originalname;
        const size = req.file.size;
        const folderId = req.currentFolder.id;

        const newFile = await query.uploadFile(name, hashedName, path, size, folderId);
        if (newFile === "File with that name already exists") {
            const path = require("path");
            const filePath = path.join("uploads", hashedName);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting the file:", err);
                        throw err;
                    }
                    console.log(`File ${hashedName} deleted successfully.`);
                });
            } else {
                console.log(`File ${hashedName} does not exist.`);
            }
        }
        // Redirect to driveGet
        return res.redirect(`/${url}`);
    }),
];
