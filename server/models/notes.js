const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  playlistId: {
    required: true,
    type: String,
  },
  videoId: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
});

const Notes = mongoose.model("notes", notesSchema);

module.exports = Notes;
