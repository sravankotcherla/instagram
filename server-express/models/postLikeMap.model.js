const mongoose = require("mongoose");

const LikesMapSchema = new mongoose.Schema({
  srcObject: {
    type: mongoose.Types.ObjectId,
    req: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    req: true,
  },
  type: {
    type: String,
    req: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const likes =
  new mongoose.model("Likes", LikesMapSchema) || mongoose.models.likes;
module.exports = likes;
