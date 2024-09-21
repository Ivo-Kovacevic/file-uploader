const { check, body } = require("express-validator");

const alphaErr = "must only contain letters and numbers.";
const folderLengthErr = "must be between 4 and 20 characters.";

const validateNewFolder = [
    check("newFolder")
        .trim()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage(`Folder name ${alphaErr}`)
        .isLength({ min: 1, max: 20 })
        .withMessage(`Folder name ${folderLengthErr}`),
];

module.exports = { validateNewFolder };
