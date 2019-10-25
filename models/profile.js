const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  id: String,
  bio: String,
  score: Number,
  points: Number,
  badges: Array,
  totalPosts: Number,
  ownPosts: Array,
  items: Array
});

module.exports = mongoose.model("profiles", profileSchema);