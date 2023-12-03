const mongoose = require("mongoose");
const express = require("express");
const authRouter = express();
const AuthControllers = require("../controllers/auth.controller");

authRouter.route("/sign-up").post(AuthControllers.signUpUser);
authRouter.route("/sign-in").get(AuthControllers.signInUser);
authRouter.route("/single-sign-in").get(AuthControllers.singleSignIn);

module.exports = { authRouter };
