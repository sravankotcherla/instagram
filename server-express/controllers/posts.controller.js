const { Post } = require("../models/posts.model");
const async = require("async");
const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const Likes = require("../models/postLikeMap.model");
const { Comment } = require("../models/comments.model");

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
  const skipNumber = parseInt(req?.query?.skip) || 0;
  async.waterfall(
    [
      function (done) {
        User.findOne({ _id: req.user._id }, { followers: 1 })
          .lean()
          .then((userData) => {
            return done(null, userData.followers);
          })
          .catch((err) => {
            done(err);
          });
      },
      function (followers, done) {
        followers = [];
        Post.aggregate([
          { $match: { createdBy: { $in: [...followers, req.user._id] } } },
          { $skip: skipNumber },
          { $limit: 5 },
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "userInfo",
            },
          },
          {
            $lookup: {
              from: "likes",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$srcObject", "$$postId"] },
                        { $eq: ["$userId", req.user._id] },
                        { $eq: ["$type", "post"] },
                        { $eq: ["$archived", false] },
                      ],
                    },
                  },
                },
              ],
              as: "isLiked",
            },
          },
        ])
          .then((postsData) => {
            return done(null, postsData);
          })
          .catch((err) => {
            return done(err);
          });
      },
    ],
    function (err, results) {
      if (err) {
        return res
          .status(400)
          .send({ message: "Failed to fetch posts", error: err });
      } else {
        return res.status(200).jsonp(results);
      }
    }
  );
};

exports.getLikedSchema = (type) => {
  switch (type) {
    case "comment": {
      return Comment;
    }
    case "post": {
      return Post;
    }
    default: {
      return Post;
    }
  }
};
exports.updatePost = (req, res) => {
  const { srcId, liked, type } = req.body;
  if (!mongoose.isValidObjectId(srcId)) {
    return res.status(400).send("Invalid srcId");
  } else {
    const srcObjId = new mongoose.Types.ObjectId(srcId);
    async.parallel(
      {
        postInfo: function (done) {
          const reqModel = exports.getLikedSchema(type);
          reqModel
            .updateOne(
              { _id: srcObjId },
              { $inc: { likes: liked ? 1 : -1 } },
              { new: true }
            )
            .then((postInfo) => {
              return done(null, postInfo);
            })
            .catch((err) => {
              return done(
                { error: err, message: "Failed to updated likes count" },
                null
              );
            });
        },
        postLikeMap: function (done) {
          const updateObj = {
            srcObject: srcObjId,
            userId: req.user._id,
            type: type,
            archived: !liked,
          };
          Likes.updateOne({ srcObject: srcObjId }, updateObj, {
            upsert: true,
          })
            .then((postLikeMap) => {
              return done(null, postLikeMap);
            })
            .catch((err) => {
              return done(
                { error: err, message: "Failed to update postLikeMap record" },
                null
              );
            });
        },
      },
      function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        } else {
          return res.status(200).send(results);
        }
      }
    );
  }
};
