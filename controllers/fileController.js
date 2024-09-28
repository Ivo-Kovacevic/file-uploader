const query = require("../db/fileQueries");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");
const supabase = require("../config/supabaseConfig");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

exports.uploadFilePost = [
    upload.single("upload_file"),
    asyncHandler(async (req, res) => {
        const file = req.file;
        const fileName = file.originalname;
        const hashedName = uuidv4();
        const size = file.size;
        const folderId = req.currentFolder.id;
        const newFile = await query.storeFile(
            fileName,
            hashedName,
            `/public/${hashedName}`,
            size,
            folderId
        );
        if (newFile === "File with that name already exists") {
            return res.redirect(req.currentUrl);
        }

        // Upload file to supabase
        const { data, error } = await supabase.storage
            .from("files")
            .upload(newFile.path, file.buffer, {
                cacheControl: "3600",
                upsert: false,
            });
        if (error) {
            console.error("Supabase upload error:", error);
            return res.status(500).send("Failed to upload file to Supabase.");
        }
        console.log("File uploaded to Supabase:", data);

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
    // Remove file name from the path array so file can be deleted both from folder and file itself
    req.pathArray.pop();
    const url = req.pathArray.join("/");

    const file = await query.getFileById(req.body.file_id);
    if (!file) {
        console.error("File not found in the database.");
        return res.redirect(`/${url}`);
    }

    // Delete file from supabase
    const { data, error } = await supabase.storage.from("files").remove([file.path]);
    if (error) {
        console.error("Error deleting file:", error);
        return res.redirect(`/${url}`);
    }
    console.log("File deleted successfully!");

    await query.deleteFile(req.body.file_id);

    // Redirect to driveGet
    return res.redirect(`/${url}`);
});

exports.changeFilePut = asyncHandler(async (req, res) => {
    const newFileName = req.body.file_name;
    const fileId = req.body.file_id;
    const fileContent = req.body.file_content;
    const parentFolderId = req.fileFolderId;
    const file = await query.changeFile(newFileName, fileId, parentFolderId);
    if (file === "File name already exists") {
        req.flash("fileExists", "File name already exists");
        return res.redirect(req.currentUrl);
    }

    // Update file on supabase
    const { error } = await supabase.storage
        .from("files")
        .update(file.path, new Blob([fileContent]), {
            contentType: "text/plain",
        });
    if (error) {
        console.error("Error updating file in Supabase:", error);
        return res.redirect(req.currentUrl);
    }

    // Redirect to driveGet
    req.pathArray.pop();
    req.pathArray.push(file.name);
    const urlNewFile = req.pathArray.join("/");

    return res.redirect(`/${urlNewFile}`);
});

exports.downloadFilePost = asyncHandler(async (req, res, next) => {
    const fileId = req.body.file_id;
    const file = await query.getFileById(fileId);
    if (file) {
        // Get the public URL for the file from Supabase
        const { data, error } = supabase.storage.from("files").getPublicUrl(file.path);
        if (error) {
            console.error("Error getting public URL:", error);
            return res.status(500).send("Could not retrieve the file URL.");
        }

        const response = await axios.get(data.publicUrl);
        res.set({
            "Content-Disposition": `attachment; filename="${file.name}"`,
        });

        res.send(response.data);
    }
    next();
});

exports.readFileGet = asyncHandler(async (req, res, next) => {
    const fileName = decodeURIComponent(req.params.name);
    const [file] = await query.getFileByName(fileName, req.fileFolderId);
    if (file) {
        // Get file from supabase
        const { data, error } = await supabase.storage.from("files").download(file.path);
        if (error) {
            console.error("Error downloading file from Supabase:", error);
            return next(error);
        }

        const text = await data.text();
        file.content = text;
        return res.render("drive", {
            pathArray: req.pathArray,
            file: file,
        });
    }
    next();
});
