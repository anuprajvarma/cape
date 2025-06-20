const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  title: {
    required: true,
    type: [String],
  },
});

const Searchs = mongoose.model("search", searchSchema);

module.exports = Searchs;
