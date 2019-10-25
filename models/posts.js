const mongoose = require("mongoose");

// -- Status Codes --
// 0 - Unhandled
// 1 - Approved
// 2 - Rejected
// 3 - Removed
// 4 - Reported

const postsSchema = new mongoose.Schema({
  id: String,
  url: String,
  upvotes: Number,
  downvotes: Number,
  publisher: String,
  moderator: String,
  status: Number
});

module.exports = mongoose.model("posts", postsSchema);