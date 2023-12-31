const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const lodash = require("lodash");

exports.signInUser = async (req, res) => {
  try {
    let { email, password } = req.query;
    const authToken = req.headers.authorization.split(" ")[1];
    let user = {};
    if (email && password) {
      user = await User.findOne({
        $or: [{ email: email }, { username: email }],
      });
      if (!user) {
        return res.status(401).send("Invalid username/email");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).send("Invalid password");
      }
    } else if (authToken) {
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
      user = await User.findOne({
        email: decodedToken.email,
        id: decodedToken.id,
        username: decodedToken.username,
      });
      console.log(user, decodedToken);
    } else {
      return res
        .status(401)
        .send("Missing Credentials and Authorization token");
    }

    const jwtPayload = {
      email: user.email,
      username: user.username,
      id: user.id,
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });
    return res.jsonp({
      token: jwtToken,
      user: lodash.omit(user, ["password", "bio", "posts", "followers"]),
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
exports.signUpUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body.user;
    const hashPassword = await bcrypt.hash(password, 10);
    const userObj = {
      id: username,
      name,
      email,
      username,
      password: hashPassword,
    };
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(401).send("User email already exists");
    }
    const newUser = User.create(userObj);
    return res.jsonp(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.checkAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send("JWT token is missing");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, result) {
      if (err || !result) {
        console.log(err);
        return res.status(401).send("Invalid authorization token");
      } else {
        next();
      }
    });
  }
};

exports.singleSignIn = async (req, res, next) => {
  try {
    const { name, email, userId, profile_picture } = req.query;
    let userData = await User.findOne({ email: email });
    let newUser = false;
    if (!userData) {
      newUser = true;
      userData = await User.create({
        name,
        email,
        id: userId,
        username: name,
        profileImg: profile_picture,
      });
    }

    const jwtPayload = {
      email: userData.email,
      username: userData.username,
      id: userData.id,
    };
    const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1hr",
    });
    return res.jsonp({
      token: jwtToken,
      user: lodash.omit(userData, ["password", "bio", "posts", "followers"]),
      newUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("err");
  }
};
