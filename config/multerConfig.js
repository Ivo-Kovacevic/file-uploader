const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "uploads/",
});
const upload = multer({ storage: storage });

module.exports = upload;
