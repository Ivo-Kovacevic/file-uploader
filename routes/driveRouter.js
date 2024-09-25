const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");
const folderController = require("../controllers/folderController");
const fileController = require("../controllers/fileController");
const { authorizeUser } = require("../middlewares/authMiddleware");
const { currentFolderMiddleware } = require("../middlewares/currentFolderMiddleware");

driveRouter.use(authorizeUser);
driveRouter.use(currentFolderMiddleware);

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.post("*_folder", folderController.createFolderPost);
driveRouter.post("*_file", fileController.uploadFilePost);

driveRouter.put("*/:name", fileController.changeFilePut);

driveRouter.patch("*_folder", folderController.renameFolderPatch);
driveRouter.patch("*_file", fileController.renameFilePatch);

driveRouter.delete("*_folder", folderController.deleteFolderDelete);
driveRouter.delete("*_file", fileController.deleteFileDelete);

driveRouter.get("*/:name", fileController.readFileGet);

driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
