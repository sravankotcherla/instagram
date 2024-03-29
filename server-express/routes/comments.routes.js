const express = require("express");
const app = express();
const CommentsController = require("../controllers/comments.controller.js");

app.route("/").post(CommentsController.createComment);
app.route("/").get(CommentsController.fetchComments);

module.exports = { commentRouter: app };
