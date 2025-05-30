const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  playlistId: {
    required: true,
    type: String,
  },
  chats: {
    required: true,
    type: [Object],
  },
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
