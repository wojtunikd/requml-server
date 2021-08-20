const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors());

app.options("/api/stories", cors({
    origin: ["https://requml.co.uk/"]
}))

const routes = require("./routes/routes");

app.use("/", routes);

const { initiateOrder } = require("./utils/scheduler/initiateOrder");

const PORT = process.env.PORT || 3333;

mongoose
    .connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT);

        setInterval(initiateOrder, 20000);
    })
    .catch(error => {
        console.log(error);
        process.exit(-1);
    })

