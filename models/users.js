const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  id: { type: String },
  blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("users", Schema);
