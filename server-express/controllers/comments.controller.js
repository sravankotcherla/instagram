const { Comment } = require("../models/comments.model");
const mongoose = require("mongoose");

exports.createComment = (req, res) => {
  const { postId, text, parent } = req.body;
  Comment.create({ postId, text, parent, createdBy: req.user._id })
    .then((resp) => {
      return res.status(200).jsonp("Comment created successfully");
    })
    .catch((err) => {
      return res
        .status(400)
        .jsonp({ message: "Failed to create comment", error: err });
    });
};
exports.fetchComments = (req, res) => {
  const { postId } = req.params;
  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).jsonp("Invalid postId");
  }
  Comment.find({ postId: postId, archived: false })
    .populate({
      path: "createdBy",
      select: "username profileImg likes followers bio",
    })
    .limit(15)
    .then((comments) => {
      return res.status(200).jsonp(comments);
    })
    .catch((err) => {
      return res
        .status(400)
        .jsonp({ messsage: "Failed to fetch comments", error: err });
    });
};
