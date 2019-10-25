const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  id: { type: Number },
  recipient: { type: String },
  channel: { type: String },
  guild: { type: String },
  subscribedRoles: { type: Array, default: null },
  subscribedUsers: { type: Array, default: null },
  nsfw: { type: Boolean, default: false },
  closed: { type: Boolean, default: false }
});

module.exports = mongoose.model("threads", Schema);
