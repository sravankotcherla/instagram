const { Post } = require("../models/posts.model");

exports.createPost = async (req, res) => {
  try {
    const { content, img, tags } = req.body;
    const newPost = await Post.create({
      content,
      img,
      tags,
      createdBy: req.user._id,
    });
    return res.status(200).jsonp(newPost);
  } catch (err) {
    console.log("Failed to create post");
    res.status(400).jsonp({ message: "Failed to create post", error: err });
  }
};
