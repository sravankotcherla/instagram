const express = require("express");
const PostController = require("../controllers/posts.controller");
const app = express();

app.route("/").put(PostController.createPost);
app.route("/").get(PostController.fetchPosts);
app.route("/likes").post(PostController.updatePost);

module.exports = { postRouter: app };
