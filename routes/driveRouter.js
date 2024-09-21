const query = require("../db/queries");
const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");

driveRouter.use(async (req, res, next) => {
    // Redirect user if they aren't logged in
    if (!req.user) {
        return driveController.unauthorizedGet(req, res);
    }

    // Add current folder contents and url path array to the request
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    const subfoldersPathArray = [...pathArray];

    const [rootFolder] = req.user.folders.filter(
        (folder) => folder.userId === req.user.id && folder.parentId === null
    );
    const currentFolder = await query.getFolderContent(
        rootFolder,
        subfoldersPathArray
    );
    if (pathArray[pathArray.length - 1] === "create-folder") {
        pathArray.pop();
    }
    req.pathArray = pathArray;
    req.currentFolder = currentFolder;
    next();
});

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.post("/upload", driveController.uploadFilePost);
driveRouter.post("*/create-folder", driveController.createFolderPost);
driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
