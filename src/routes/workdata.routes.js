const {Router} = require("express");

const WorkDataController = require("../controllers/WorkDataController");

const workdataRoutes = Router();

const workdataController = new WorkDataController();


workdataRoutes.get("/:name", workdataController.status);
workdataRoutes.get("/hist/:name", workdataController.hist);
workdataRoutes.post("/", workdataController.create);

module.exports = workdataRoutes;