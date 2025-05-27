const mongoose = require("mongoose");

const dbConnection = (url) => {
  mongoose.connect(url).then(console.log("connection stablished"));
};

module.exports = dbConnection;
