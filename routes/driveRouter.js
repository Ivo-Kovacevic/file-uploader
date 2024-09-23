const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const { authorizeUser } = require("../middlewares/authMiddleware");
const { currentFolderMiddleware } = require("../middlewares/currentFolderMiddleware");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

driveRouter.use(authorizeUser);
driveRouter.use(currentFolderMiddleware);

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.delete("*", (req, res, next) => {
    if (req.body.folder_id) {
        return folderController.deleteFolderDelete(req, res, next);
    } else if (req.body.file_id) {
        return fileController.deleteFileDelete(req, res, next);
    }
    next();
});

driveRouter.post("*", (req, res, next) => {
    upload.single("upload_file")(req, res, () => {
        if (req.body.folder_name) {
            return folderController.createFolderPost(req, res, next);
        }
        return fileController.uploadFilePost(req, res);
    });
});

driveRouter.get("*/:name", fileController.readFileGet);

driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
