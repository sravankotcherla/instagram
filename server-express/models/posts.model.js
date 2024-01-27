const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    default: "",
  },
  img: {
    type: String,
  },
  tags: [
    {
      type: mongoose.SchemaTypes.ObjectId,
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = new mongoose.model("Post", postSchema) || mongoose.models.posts;
module.exports = { Post };
