import { Post } from "./posts.model";

const mongoose = require("mongoose");

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
    required: true,
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

export const User =
  new mongoose.model("User", userSchema) || mongoose.models.users;
