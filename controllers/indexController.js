const { validationResult } = require("express-validator");
const { validateNewUser } = require("../validation/user-validation");

const indexGet = async (req, res) => {
    const messages = await db.getAllMessages();
    res.render("index", { messages });
};

module.exports = {
    indexGet,
};
