const express = require("express");
const Routes = require("./routes/Routes");
const {dbConnect}= require("./config/database");
const bodyParser = require('body-parser')
const cookieParser= require("cookie-parser")
require('dotenv').config();
dbConnect();
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", Routes);

app.listen(process.env.PORT, ()=>{
    console.log(`App started on port ${process.env.PORT}`)
})