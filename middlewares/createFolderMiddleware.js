const query = require("../db/queries");
const asyncHandler = require("express-async-handler");

exports.createFolderMiddleware = asyncHandler(async (req, res, next) => {
    // Add current folder contents and url path array to the request
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    pathArray.pop();

    const subfoldersPathArray = [...pathArray];
    const [rootFolder] = req.user.folders.filter(
        (folder) => folder.userId === req.user.id && folder.parentId === null
    );
    const currentFolder = await query.getFolderContent(
        rootFolder,
        subfoldersPathArray
    );
    req.pathArray = pathArray;
    req.currentFolder = currentFolder;
    next();
});
