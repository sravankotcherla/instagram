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

exports.fetchPosts = async (req, res) => {
  try {
    const skipNumber = req?.query?.skip || 0;
    const posts = await Post.find({ createdBy: req.user._id })
      .skip(skipNumber)
      .limit(5);
    return res.status(200).jsonp(posts);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Failed to fetch posts", error: err });
  }
};
