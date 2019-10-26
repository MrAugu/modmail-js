const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  id: { type: Number },
  recipient: { type: String },
  channel: { type: String },
  guild: { type: String },
  issue: { type: String },
  subscribedRoles: { type: Array, default: [] },
  subscribedUsers: { type: Array, default: [] },
  nsfw: { type: Boolean, default: false },
  closed: { type: Boolean, default: false },
  timestamp: { type: Number }
});

module.exports = mongoose.model("threads", Schema);
