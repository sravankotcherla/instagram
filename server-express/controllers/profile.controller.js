const mongoose = require("mongoose");
const { Follow } = require("../models/follow.model");
const { User } = require("../models/user.model");
const async = require("async");

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
