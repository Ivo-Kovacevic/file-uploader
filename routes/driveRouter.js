const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");
const { authorizeUser } = require("../middlewares/authMiddleware");
const { currentFolderMiddleware } = require("../middlewares/currentFolderMiddleware");
const { createFolderMiddleware } = require("../middlewares/createFolderMiddleware");
const { uploadFileMiddleware } = require("../middlewares/uploadFileMiddleware");

driveRouter.use(authorizeUser);

driveRouter.get("*/:id/delete-folder", driveController.deleteFolderGet);
driveRouter.post("*/create-folder", createFolderMiddleware, driveController.createFolderPost);

driveRouter.post("*/upload-file", uploadFileMiddleware, driveController.uploadFilePost);

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.get("/*", currentFolderMiddleware, driveController.driveGet);

module.exports = driveRouter;
