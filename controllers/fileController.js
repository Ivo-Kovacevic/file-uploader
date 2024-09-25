const fs = require("fs");
const path = require("path");
const query = require("../db/fileQueries");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

exports.uploadFilePost = [
    upload.single("upload_file"),
    asyncHandler(async (req, res) => {
        const url = req.pathArray.join("/");

        const name = req.file.originalname;
        const hashedName = req.file.filename;
        const path = req.file.originalname;
        const size = req.file.size;
        const folderId = req.currentFolder.id;
        const newFile = await query.uploadFile(name, hashedName, path, size, folderId);

        // console.log(cloudinary);
        // const result = await cloudinary.uploader.upload(`./uploads/${hashedName}`);

        // Redirect to driveGet
        return res.redirect(req.currentUrl);
    }),
];

exports.renameFilePatch = asyncHandler(async (req, res) => {
    const fileName = req.body.file_name;
    const fileId = req.body.file_id;
    const parentFolderId = req.currentFolder.id;
    const file = await query.renameFile(fileName, fileId, parentFolderId);
    if (file === "File name already exists") {
        req.flash("fileExists", "File name already exists");
    }

    // Redirect to driveGet
    return res.redirect(req.currentUrl);
});

exports.deleteFileDelete = asyncHandler(async (req, res) => {
    const file = await query.deleteFile(req.body.file_id);

    // Delete file from system
    const path = require("path");
    const filePath = path.join("uploads", file.hashedName);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting the file:", err);
                throw err;
            }
            console.log(`File ${file.hashedName} deleted successfully.`);
        });
    } else {
        console.log(`File ${file.hashedName} does not exist.`);
    }

    // Redirect to driveGet
    return res.redirect(req.currentUrl);
});

exports.changeFilePut = asyncHandler(async (req, res) => {
    const prevFileName = decodeURIComponent(req.params.name);
    const newFileName = req.body.file_name;
    const fileId = req.body.file_id;
    const fileContent = req.body.file_content;
    const parentFolderId = req.fileFolderId;
    const file = await query.changeFile(newFileName, fileId, parentFolderId);
    if (file === "File name already exists") {
        req.flash("fileExists", "File name already exists");
        return res.redirect(req.currentUrl);
    }

    fs.writeFile(path.join(__dirname, "../uploads", file.hashedName), fileContent, (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Redirect to driveGet
    req.pathArray.pop();
    req.pathArray.push(file.name);
    const urlNewFile = req.pathArray.join("/");

    return res.redirect(`/${urlNewFile}`);
});

exports.readFileGet = asyncHandler(async (req, res, next) => {
    const fileName = decodeURIComponent(req.params.name);
    const [file] = await query.readFile(fileName, req.fileFolderId);
    if (file) {
        const path = require("path");
        fs.readFile(path.join(__dirname, "../uploads", file.hashedName), "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            file.content = data;
            const test = data.split("\n");
            return res.render("drive", {
                pathArray: req.pathArray,
                file: file,
            });
        });

        return;
    }
    next();
});
