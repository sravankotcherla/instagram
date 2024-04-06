const express = require("express");
const PostController = require("../controllers/posts.controller");
const app = express();
const { upload } = require("../controllers/uploadMedia.controller");

app.route("/").post(upload.single("postImg"), PostController.createPost);
app.route("/").get(PostController.fetchPosts);
app.route("/likes").post(PostController.updatePost);

module.exports = { postRouter: app };
