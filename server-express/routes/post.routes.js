const express = require("express");
const PostController = require("../controllers/posts.controller");
const app = express();

app.route("/").put(PostController.createPost);

module.exports = { postRouter: app };
