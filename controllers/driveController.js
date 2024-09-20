const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");
const upload = require("../config/multerConfig");
const asyncHandler = require("express-async-handler");

const unauthorizedGet = asyncHandler(async (req, res) => {
    res.render("unauthorized");
});

const driveGet = asyncHandler(async (req, res) => {
    res.render("drive");
});

const uploadFilePost = [
    upload.single("uploadFile"),
    asyncHandler(async (req, res, next) => {
        res.redirect("/drive");
    }),
];

module.exports = {
    unauthorizedGet,
    driveGet,
    uploadFilePost,
};
