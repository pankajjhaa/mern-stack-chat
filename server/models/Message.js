const mongoose = require('mongoose')
const User = require("./User");
const Chat = require("./Chat");

const MessageSchema = mongoose.Schema({
        sender: {type: mongoose.Schema.Types.ObjectId, ref: User},
        content: {type: String, trim: true},
        chat: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"}
    },
    {
        timestamps: true
    }
)

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message
