const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.indexGet);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/register", indexController.registerGet);

module.exports = indexRouter;
