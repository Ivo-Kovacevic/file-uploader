const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

const unauthorizedGet = asyncHandler(async (req, res) => {
    res.render("unauthorized");
});

const driveGet = asyncHandler(async (req, res) => {
    res.render("drive");
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
};
