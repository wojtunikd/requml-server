const mongoose = require("mongoose");
const { Schema } = mongoose;

const processSchema = new Schema({
    idle: { type: Boolean, required: true },
})

module.exports = mongoose.model("Process", processSchema);