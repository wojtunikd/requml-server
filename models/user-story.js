const mongoose = require("mongoose");
const { Schema } = mongoose;

const userStorySchema = new Schema({
    role: { type: String, required: true },
    action: { type: String, required: true }
})

exports.userStorySchema = userStorySchema;

module.exports = {
    userStorySchema: userStorySchema,
    UserStory: mongoose.model("UserStory", userStorySchema)
}