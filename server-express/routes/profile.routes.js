const express = require("express");
const ProfileController = require("../controllers/profile.controller");
const app = express();

app
  .route("/")
  .post(ProfileController.updateProfile)
  .get(ProfileController.getProfile);

app.put("/follow", ProfileController.followUser);

app.get("/posts", ProfileController.getPosts);

module.exports = { profileRouter: app };
