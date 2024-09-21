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
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    const [rootFolder] = req.user.folders.filter(
        (folder) => folder.userId === req.user.id && folder.parentId === null
    );

    const currentFolder = await query.getFolderContent(rootFolder, pathArray);

    res.render("drive", {
        currentUrl: req.originalUrl,
        currentFolder: currentFolder,
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
            });
        }

        const newFolderName = req.body.newFolder;
        const userId = req.user.id;
        const parentFolderId = req.user.folders[0].id;

        await query.createNewFolder(newFolderName, userId, parentFolderId);
        res.redirect("/drive");
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
