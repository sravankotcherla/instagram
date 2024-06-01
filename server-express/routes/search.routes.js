const express = require("express");
const ProfileSearchController = require("../controllers/profileSearch.controller.js");

const app = express();
app.route("/").get(ProfileSearchController.getSearchResults);

module.exports = { searchRouter: app };
