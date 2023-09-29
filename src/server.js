require("express-async-errors")
require("dotenv/config")
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const cors = require('cors');

const express = require("express")
const routes = require("./routes")

migrationsRun()

const app = express()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*'); // Permite solicitações de qualquer origem
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json())

app.use(cors());

app.use(routes)

app.use((error, request, response, next) => {
    if(error instanceof AppError){
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message
      })
    }
  
    console.error(error)
  
    return response.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  })


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));