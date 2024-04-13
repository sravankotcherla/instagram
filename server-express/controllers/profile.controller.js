const mongoose = require("mongoose");
const { Follow } = require("../models/follow.model");
const { User } = require("../models/user.model");
const async = require("async");
const { Post } = require("../models/posts.model");
const { hostMedia } = require("./uploadMedia.controller");

exports.updateProfile = async (req, res) => {
  const { bio, profileImg, gender } = req.body;
  const payload = { bio, profileImg, gender };
  try {
    const updatedUser = await User.updateOne(
      { id: req.user.id },
      { $set: payload },
      { returnDocument: "after" }
    );
    return res.status(200).jsonp(updatedUser);
  } catch (err) {
    return res.status(400).jsonp({
      message: "Failed to update user profile",
      error: err,
    });
  }
};

exports.getProfile = (req, res) => {
  try {
    const { username } = req.query;
    async.waterfall(
      [
        function (done) {
          User.findOne({ username }, { password: 0 })
            .lean()
            .then((userProfile) => {
              return done(null, userProfile);
            })
            .catch((err) => {
              return done(err, null);
            });
        },
        function (userProfile, done) {
          Follow.find({
            srcObjectId: req.user._id,
            destObjectId: userProfile._id.toString(),
            archived: false,
          })
            .then((follows) => {
              userProfile.isFollowed = follows.length > 0;
              return done(null, userProfile);
            })
            .catch((err) => {
              return done(err, null);
            });
        },
      ],
      function (err, results) {
        if (err) {
          return res.status(400).jsonp({
            message: "Failed to fetch user profile",
            error: err,
          });
        }
        return res.status(200).jsonp(results);
      }
    );
  } catch (err) {
    return res.status(400).jsonp({
      message: "Server Error: Failed to fetch user profile",
      error: err,
    });
  }
};

exports.followUser = (req, res) => {
  try {
    let { userId, following } = req.body;
    userId = new mongoose.Types.ObjectId(userId);
    console.log(userId);
    async.parallel(
      [
        function (done) {
          if (following) {
            Follow.create({
              srcObjectId: req.user._id,
              destObjectId: userId,
            })
              .then((follow) => {
                return done(null, follow);
              })
              .catch((err) => {
                return done(err);
              });
          } else {
            Follow.updateOne(
              {
                srcObjectId: req.user._id,
                destObjectId: userId,
              },
              { archived: true }
            )
              .then((follow) => {
                return done(null, follow);
              })
              .catch((err) => {
                return done(err);
              });
          }
        },
        function (done) {
          User.findOneAndUpdate(
            { _id: userId },
            { $inc: { followers: following ? 1 : -1 } },
            { new: true }
          )
            .lean()
            .then((user) => {
              const { password, ...userProfile } = user;
              return done(null, userProfile);
            })
            .catch((err) => {
              return done(err);
            });
        },
        function (done) {
          User.updateOne(
            { _id: req.user._id },
            { $inc: { following: following ? 1 : -1 } }
          )
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        },
      ],
      function (err, results) {
        if (err) {
          return res.status(400).jsonp({
            message: "Failed to follow user",
            error: err,
          });
        }
        return res.status(200).jsonp(results[1]);
      }
    );
  } catch (err) {
    return res.status(400).jsonp({
      message: "Server Error: Failed to follow user",
      error: err,
    });
  }
};

exports.getPosts = (req, res) => {
  try {
    const { type, skipNumber, userId } = req.query;
    let filter = {};
    switch (type) {
      case "posts": {
        filter = {
          createdBy: userId
            ? new mongoose.Types.ObjectId(userId)
            : req.user._id,
        };
        break;
      }
      case "tagged": {
        filter = { tags: { $in: [req.user._id] } };
      }
    }
    async.waterfall(
      [
        function (done) {
          Post.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: parseInt(skipNumber) || 0 },
            { $limit: 9 },
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
            .allowDiskUse(true)
            .then((resp) => {
              return done(null, resp);
            })
            .catch((err) => {
              return done(err);
            });
        },
        function (posts, done) {
          const imgs = posts.reduce((accum, { media }) => {
            const mediaData = Object.keys(media).map((index) => {
              return {
                name: media[parseInt(index)].fileName,
                img: media[parseInt(index)].fileName,
              };
            });
            return [...accum, ...mediaData];
          }, []);
          hostMedia(imgs, function (err, results) {
            if (err) {
              return done(err);
            }
            return done(null, posts);
          });
        },
      ],
      function (err, results) {
        if (err) {
          return res.status(500).jsonp({
            message: "Mongoose Error : Failed to fetch posts from mongodb",
            error: err,
          });
        }
        return res.status(200).jsonp(results);
      }
    );
  } catch (err) {
    return res.status(500).jsonp({
      message: "Server Error: Failed to fetch profile posts",
      error: err,
    });
  }
};
