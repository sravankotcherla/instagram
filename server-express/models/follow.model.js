const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  srcObjectId: {
    type: String,
    required: true,
  },
  destObjectId: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const Follow =
  new mongoose.model("Follow", followSchema) || mongoose.models.follows;
module.exports = { Follow };
