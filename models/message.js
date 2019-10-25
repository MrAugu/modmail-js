const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  thread: { type: Number },
  message: { type: String },
  recipient: { type: String },
  channel: { type: String },
  content: { type: String },
  author: { type: String },
  timestamp: { type: Number }
});

module.exports = mongoose.model("messages", Schema);
