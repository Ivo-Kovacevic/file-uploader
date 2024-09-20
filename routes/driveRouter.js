const { Router } = require("express");
const driveRouter = Router();
const driveController = require("../controllers/driveController");

driveRouter.use((req, res, next) => {
    if (!req.user) {
        return driveController.unauthorizedGet(req, res);
    }
    next();
});

driveRouter.get("/", driveController.driveGet);
driveRouter.post("/upload", driveController.uploadFilePost);

module.exports = driveRouter;
