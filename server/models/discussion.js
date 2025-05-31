const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  playlistId: {
    required: true,
    type: String,
  },
  videoId: {
    required: true,
    type: String,
  },
  discussions: {
    required: true,
    type: [Object],
  },
});

const Discussion = mongoose.model("discussion", discussionSchema);

module.exports = Discussion;
