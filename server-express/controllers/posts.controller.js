const { Post } = require("../models/posts.model");
const async = require("async");
const { User } = require("../models/user.model");
const mongoose = require("mongoose");
const Likes = require("../models/postLikeMap.model");
const { Comment } = require("../models/comments.model");
const fs = require("fs");
const { hostMedia } = require("./uploadMedia.controller");
const { Follow } = require("../models/follow.model");

exports.createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const mediaContent = req.files.map((file) => {
      const mediaType = file.mimetype.split("/")[0];
      return { fileName: file.filename, type: mediaType };
    });
    const newPost = await Post.create({
      content,
      media: mediaContent,
      tags: tags?.length ? tags.split(",") : [],
      createdBy: req.user._id,
    });
    res.status(200).jsonp(newPost);
  } catch (err) {
    console.log("Failed to create post \n", err);
    res.status(400).jsonp({ message: "Failed to create post", error: err });
  }
};

exports.fetchPosts = async (req, res) => {
  const skipNumber = parseInt(req?.query?.skip) || 0;
  async.waterfall(
    [
      function (done) {
        Follow.find(
          { srcObjectId: req.user._id, archived: false },
          { destObjectId: 1 }
        )
          .lean()
          .then((followMaps) => {
            const following = followMaps.map(
              ({ destObjectId }) => new mongoose.Types.ObjectId(destObjectId)
            );
            return done(null, following);
          })
          .catch((err) => {
            done(err);
          });
      },
      function (following, done) {
        Post.aggregate([
          { $match: { createdBy: { $in: [...following, req.user._id] } } },
          { $sort: { createdAt: -1 } },
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
      function (postsData, done) {
        const imagesData = postsData.reduce((accum, { media }) => {
          const mediaData = Object.keys(media).map((index) => {
            return {
              name: media[parseInt(index)].fileName,
              img: media[parseInt(index)].fileName,
            };
          });
          return [...accum, ...mediaData];
        }, []);
        hostMedia(imagesData, function (err, results) {
          if (err) {
            return done(err);
          } else {
            return done(null, postsData);
          }
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
