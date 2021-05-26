const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors());

const routes = require("./routes/routes");

app.use("/", routes);

// scheduler to send to flask when idle and unprocessed request available in database

const PORT = process.env.PORT || 3333;

mongoose
    .connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT))
    .catch(error => console.log(error))

