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
driveRouter.patch("*_folder", folderController.renameFolderPatch);
driveRouter.delete("*_folder", folderController.deleteFolderDelete);

driveRouter.post("*_file", fileController.uploadFilePost);
driveRouter.patch("*_file", fileController.renameFilePatch);
driveRouter.delete("*_file", fileController.deleteFileDelete);
driveRouter.put("*/:name", fileController.changeFilePut);
driveRouter.get("*/:name", fileController.readFileGet);

driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
