const mongoose = require("mongoose");
const { Schema } = mongoose;

const { userStorySchema } = require("./user-story");

const requestSchema = new Schema({
    date: { type: Date, default: Date.now, required: true },
    email: { type: String, required: true },
    completed: { type: Boolean, required: true },
    userStories: [userStorySchema],
    fullSentences: [String],
    diagrams: {
        class: String,
        useCase: String
    },
    ucParam: { type: String, required: false },
    actorsWithUseCases: { type: Array, required: false }
})

module.exports = {
    Request: mongoose.model("Request", requestSchema)
}