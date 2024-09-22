const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");
const { authorizeUser } = require("../middlewares/authMiddleware");
const { currentFolderMiddleware } = require("../middlewares/currentFolderMiddleware");

driveRouter.use(authorizeUser);
driveRouter.use(currentFolderMiddleware);

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.get("*/:id/delete-folder", driveController.deleteFolderGet);
driveRouter.post("*/create-folder", driveController.createFolderPost);

driveRouter.get("*/:id/delete-file", driveController.deleteFileGet);
driveRouter.get("*/:id", driveController.readFileGet);
driveRouter.post("*/upload-file", driveController.uploadFilePost);

driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
