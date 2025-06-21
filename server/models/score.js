const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
  videoId: {
    required: true,
    type: String,
  },
  playlistId: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  score: {
    required: true,
    type: String,
  },
});

const UserScore = mongoose.model("userScore", userScoreSchema);

module.exports = UserScore;
