const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  imageUrl: {
    required: true,
    type: String,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
