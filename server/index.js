const express = require("express");
const next = require("next");
const mongoose = require("mongoose");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const { authRouter } = require("../server-express/routes/auth.routes");
const { checkAuth } = require("../server-express/controllers/auth.controller");
const { profileRouter } = require("../server-express/routes/profile.routes");
const { postRouter } = require("../server-express/routes/post.routes");
const {
  commentRouter,
} = require("../server-express/routes/comments.routes.js");
const { searchRouter } = require("../server-express/routes/search.routes");

let gridFsBucket;

function connectToDB(cb) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB successfully");
      cb();
    })
    .catch((err) => {
      console.log("Failed to connect to DB : ", err);
      throw new err();
    });

  mongoose.connection.on("connected", () => {
    var db = mongoose.connections[0].db;
    gridFsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "media" });
    console.log("GridFs bucket created successfully");
  });
}

app
  .prepare()
  .then(() => {
    try {
      if (!fs.existsSync("./images")) {
        fs.mkdirSync("./images");
      }
    } catch (err) {
      console.log("Failed to create images directory", err);
    }
    connectToDB(() => {
      const server = express();

      server.use(bodyParser.json({ limit: "100mb" })); // for parsing application/json
      server.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
      server.use(cookieParser());

      server.use(express.static("images"));

      server.use("/auth", authRouter);

      server.use("/api", checkAuth);
      server.use("/api/profile", profileRouter);
      server.use("/api/posts", postRouter);
      server.use("/api/comment", commentRouter);
      server.use("/api/search/profile", searchRouter);

      server.get("*", (req, res) => {
        return handle(req, res);
      });

      server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
      });
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

exports.gridFsBucket = gridFsBucket;
