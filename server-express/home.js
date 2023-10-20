const express = require("express");

const homeRouter = express();

homeRouter.get("/", (req, res) => {
  res.send("server responded");
});

module.exports = {homeRouter};
