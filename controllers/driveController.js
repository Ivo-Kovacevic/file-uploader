const fs = require("fs");
const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");
const { render } = require("ejs");
const { log } = require("console");
const cloudinary = require("../config/cloudinaryConfig");

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

        const url = req.pathArray.join("/");

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
    const folderId = decodeURIComponent(req.params.id);
    await query.deleteFolder(folderId);

    // Remove folderId from the url
    req.pathArray.pop();
    const url = req.pathArray.join("/");

    // Redirect to driveGet
    return res.redirect(`/${url}`);
});

exports.uploadFilePost = [
    upload.single("newFile"),
    asyncHandler(async (req, res) => {
        const url = req.pathArray.join("/");

        const name = req.file.originalname;
        const hashedName = req.file.filename;
        const path = req.file.originalname;
        const size = req.file.size;
        const folderId = req.currentFolder.id;
        const newFile = await query.uploadFile(name, hashedName, path, size, folderId);

        // console.log(cloudinary);
        // const result = await cloudinary.uploader.upload(`./uploads/${hashedName}`);

        // Redirect to driveGet
        return res.redirect(`/${url}`);
    }),
];

exports.deleteFileGet = asyncHandler(async (req, res) => {
    const fileId = decodeURIComponent(req.params.id);
    const file = await query.deleteFile(fileId);

    // Delete file from system
    const path = require("path");
    const filePath = path.join("uploads", file.hashedName);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting the file:", err);
                throw err;
            }
            console.log(`File ${file.hashedName} deleted successfully.`);
        });
    } else {
        console.log(`File ${file.hashedName} does not exist.`);
    }

    // Remove folderId from the url
    req.pathArray.pop();
    const url = req.pathArray.join("/");

    // Redirect to driveGet
    return res.redirect(`/${url}`);
});

exports.readFileGet = asyncHandler(async (req, res, next) => {
    const fileName = decodeURIComponent(req.params.name);
    if (!req.currentFolder) {
        const [file] = await query.readFile(fileName, req.fileFolderId);
        const path = require("path");
        fs.readFile(path.join(__dirname, "../uploads", file.hashedName), "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            return res.render("drive", {
                pathArray: req.pathArray,
                fileContent: data,
            });
        });
        return;
    }
    next();
});
