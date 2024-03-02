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
  let { postId, parent } = req.query;
  if (!parent) {
    parent = null;
  } else {
    parent = { $toObjectId: parent };
  }
  if (!mongoose.isValidObjectId(postId)) {
    return res.status(400).jsonp("Invalid postId");
  }
  Comment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$postId", { $toObjectId: postId }] },
            { $eq: ["$archived", false] },
            { $eq: ["$parent", parent] },
          ],
        },
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 15 },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              username: 1,
              profileImg: 1,
              likes: 1,
              followers: 1,
              bio: 1,
            },
          },
        ],
        as: "author",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { currId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$srcObject", "$$currId"] },
                  { $eq: ["$userId", req.user._id] },
                  { $eq: ["$type", "comment"] },
                  { $eq: ["$archived", false] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "isLikedByUser",
      },
    },
    {
      $lookup: {
        from: "comments",
        let: { currId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$parent", "$$currId"] } } },
          { $count: "replies" },
        ],
        as: "replyInfo",
      },
    },
    {
      $addFields: {
        createdBy: { $arrayElemAt: ["$author", 0] },
        replyInfo: { $arrayElemAt: ["$replyInfo", 0] },
        isLiked: { $arrayElemAt: ["$isLikedByUser", 0] },
      },
    },
    {
      $project: { author: 0, isLikedByUser: 0 },
    },
  ])
    .then((comments) => {
      return res.status(200).jsonp(comments);
    })
    .catch((err) => {
      return res
        .status(400)
        .jsonp({ messsage: "Failed to fetch comments", error: err });
    });
};
