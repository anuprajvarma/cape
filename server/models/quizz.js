const mongoose = require("mongoose");

const quizzSchema = new mongoose.Schema({
  videoId: {
    required: true,
    type: String,
  },
  playlistId: {
    required: true,
    type: String,
  },
  quizz: {
    required: true,
    type: Object,
  },
});

const Quizz = mongoose.model("quizz", quizzSchema);

module.exports = Quizz;
