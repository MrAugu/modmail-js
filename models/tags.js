const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  "keyword": { type: String },
  "content": { type: String }
});

module.exports = mongoose.model("tags", Schema);
