const express = require("express");
const ProfileController = require("../controllers/profile.controller");
const app = express();

app
  .route("/")
  .post(ProfileController.updateProfile)
  .get(ProfileController.getProfile);

app.put("/follow", ProfileController.followUser);

module.exports = { profileRouter: app };
