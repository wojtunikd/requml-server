const mongoose = require("mongoose");
const { Schema } = mongoose;

const { userStorySchema } = require("./user-story");

const requestSchema = new Schema({
    email: { type: String, required: true },
    completed: { type: Boolean, required: true },
    userStories: [userStorySchema],
    fullSentences: [String],
    diagrams: {
        class: String,
        useCase: String
    }
})

module.exports = mongoose.model("Request", requestSchema);