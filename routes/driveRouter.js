const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");

driveRouter.use((req, res, next) => {
    if (!req.user) {
        return driveController.unauthorizedGet(req, res);
    }
    next();
});

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.post("/create-folder", driveController.createFolderPost);
driveRouter.post("/upload", driveController.uploadFilePost);
driveRouter.get("/*", driveController.driveGet);
// driveRouter.get("/*", driveController.foldersGet);

module.exports = driveRouter;
