const { check, body } = require("express-validator");
const query = require("../db/queries");
const { validationResult } = require("express-validator");
const { validateNewFolder } = require("../validation/folder-validation");
const asyncHandler = require("express-async-handler");

exports.createFolderPost = [
    validateNewFolder,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        // Redirect if folder validation fails
        if (!errors.isEmpty()) {
            req.flash("errors", errors.array());
            return res.redirect(req.currentUrl);
        }

        // Create new folder if validation passes
        const newFolderName = req.body.folder_name;
        const userId = req.user.id;
        const parentFolderId = req.currentFolder.id;
        const newFolder = await query.createNewFolder(newFolderName, userId, parentFolderId);
        if (newFolder === "Folder name already exists") {
            req.flash("folderExists", "Folder name already exists");
        }

        // Redirect to driveGet
        return res.redirect(req.currentUrl);
    }),
];

exports.deleteFolderDelete = asyncHandler(async (req, res) => {
    await query.deleteFolder(req.body.folder_id);

    // Redirect to driveGet
    return res.redirect(req.currentUrl);
});
