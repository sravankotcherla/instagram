const express = require("express");
const ProfileController = require("../controllers/profile.controller");
const app = express();

app.route("/").post(ProfileController.updateProfile);

module.exports = { profileRouter: app };
