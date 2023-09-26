
// require express
const express = require("express")

//create an app using express constructor
const weatherApp = express()

require('dotenv').config();

// declare your port
const port = process.env.PORT || 3000

// declare route
const routes = require("./api/routes")

// routing app
routes(weatherApp)

// app listening
weatherApp.listen(port, ()=>{
    console.log("Server is running on:" + port)
})