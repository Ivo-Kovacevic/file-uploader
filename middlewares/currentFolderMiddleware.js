const query = require("../db/folderQueries");
const asyncHandler = require("express-async-handler");

exports.currentFolderMiddleware = asyncHandler(async (req, res, next) => {
    // Add current folder contents and url path array to the request
    const pathArray = req.originalUrl.split("/").filter((item) => item !== "");
    if (
        pathArray[pathArray.length - 1] === "_folder" ||
        pathArray[pathArray.length - 1] === "_file"
    ) {
        pathArray.pop();
    }
    const url = pathArray.join("/");

    const subfoldersPathArray = [...pathArray];
    const [rootFolder] = req.user.folders.filter(
        (folder) => folder.userId === req.user.id && folder.parentId === null
    );
    const folderContents = await query.getFolderContent(rootFolder, subfoldersPathArray);

    req.fileFolderId = folderContents.lastValidFolderId;
    req.currentFolder = folderContents.currentFolder;
    req.pathArray = pathArray;
    req.currentUrl = `/${url}`;
    next();
});
