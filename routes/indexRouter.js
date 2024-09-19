const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.indexGet);

indexRouter.get("/login", indexController.loginGet);
indexRouter.post("/login", indexController.loginPost);

indexRouter.get("/register", indexController.registerGet);
indexRouter.post("/register", indexController.registerPost);

indexRouter.get("/logout", indexController.logoutGet);

module.exports = indexRouter;
