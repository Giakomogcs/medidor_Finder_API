const {Router} = require("express");

const WorkDataController = require("../controllers/WorkDataController");

const workdataRoutes = Router();

const workdataController = new WorkDataController();


workdataRoutes.get("/:name", workdataController.status);
workdataRoutes.get("/state/:name", workdataController.state);
workdataRoutes.post("/", workdataController.create);

module.exports = workdataRoutes;