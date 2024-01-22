const { User } = require("../models/user.model");

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
