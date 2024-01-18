const mongoose = require("mongoose");
const { Post } = require("./posts.model.js");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  profileImg: {
    type: String,
  },
  gender: {
    type: {
      value: String,
      type: String,
    },
  },
  posts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: Post,
    },
  ],
  followers: {
    type: Number,
    default: 0,
  },
});

const User = new mongoose.model("User", userSchema) || mongoose.models.users;
module.exports = { User };
