const {Router} = require("express")

const MachineController = require("../controllers/MachineController.js")

const machineRoutes = Router()

const machineController = new MachineController()

machineRoutes.post("/", machineController.create)
machineRoutes.get("/", machineController.register)

module.exports = machineRoutes