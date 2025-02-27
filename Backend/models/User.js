const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    messages: [{
        text: { type: String, required: true },
        model: { type: String, required: true },
        sender : String
    }]
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Chats: {
        type: [chatSchema],
    },
    Password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
