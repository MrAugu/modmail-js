const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  thread: { type: Number },
  message: { type: String },
  recipient: { type: String },
  channel: { type: String },
  content: { type: String },
  author: { type: String },
  attachments: { type: Array },
  timestamp: { type: Number },
  anonymous: { type: Boolean, default: false }
});

module.exports = mongoose.model("messages", Schema);
