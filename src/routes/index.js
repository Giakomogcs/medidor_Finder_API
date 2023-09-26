const {Router} = require("express")
const machineRoutes = require("./machine.routes")
const workdataRoutes = require("./workdata.routes")

const routes = Router()
routes.use("/machine", machineRoutes)
routes.use("/data", workdataRoutes)

module.exports = routes