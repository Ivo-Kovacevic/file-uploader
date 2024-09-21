const query = require("../db/queries");
const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");

driveRouter.use(async (req, res, next) => {
    // Redirect user if they isn't logged in
    if (!req.user) {
        return driveController.unauthorizedGet(req, res);
    }

    // Add current folder contents to the request
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    const [rootFolder] = req.user.folders.filter(
        (folder) => folder.userId === req.user.id && folder.parentId === null
    );
    const currentFolder = await query.getFolderContent(rootFolder, pathArray);
    if (pathArray[pathArray.length - 1] === "create-folder") {
        pathArray.pop();
    }
    console.log(pathArray);

    req.currentFolder = currentFolder;
    req.pathArray = pathArray;
    next();
});

driveRouter.get("/logout", driveController.logoutGet);

driveRouter.post("*/create-folder", driveController.createFolderPost);
driveRouter.post("/upload", driveController.uploadFilePost);
driveRouter.get("/*", driveController.driveGet);

module.exports = driveRouter;
