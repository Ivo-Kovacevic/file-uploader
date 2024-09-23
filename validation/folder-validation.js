const { check, body } = require("express-validator");

const validateNewFolder = [
    check("folder_name")
        .trim()
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage(`Folder name must only contain letters and numbers.`)
        .isLength({ min: 1, max: 20 })
        .withMessage(`Folder name must be between 1 and 20 characters.`),
];

module.exports = { validateNewFolder };
