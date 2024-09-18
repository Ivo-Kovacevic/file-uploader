const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");

driveRouter.get("/", driveController.driveGet);

module.exports = driveRouter;
