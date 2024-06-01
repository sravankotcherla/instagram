const express = require("express");
const next = require("next");
const mongoose = require("mongoose");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
require("dotenv").config({ path: "./.env" });
const { authRouter } = require("../server-express/routes/auth.routes");
const { checkAuth } = require("../server-express/controllers/auth.controller");
const { profileRouter } = require("../server-express/routes/profile.routes");
const { postRouter } = require("../server-express/routes/post.routes");
const {
  commentRouter,
} = require("../server-express/routes/comments.routes.js");
const { searchRouter } = require("../server-express/routes/search.routes");
const { clearMediaCacheJob } = require("../server-express/cron-jobs/media.js");

let gridFsBucket;

function connectToDB(cb) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
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
      // making images cache for hosting post images
      if (!fs.existsSync("./images")) {
        fs.mkdirSync("./images");
      }

      //initiate cron jobs
      clearMediaCacheJob.start();
    } catch (err) {
      console.log("Failed to create images directory", err);
    }
    connectToDB(() => {
      const server = express();

      server.use(bodyParser.json()); // for parsing application/json
      server.use(bodyParser.urlencoded({ extended: true }));
      server.use(cookieParser());

      server.use(express.static("images"));

      server.use("/auth", authRouter);

      server.get("/api/video", (req, res) => {
        const range = req.headers.range;
        if (!range) {
          return res.status(400).send("Missing range in request");
        }

        const videoSize = fs.statSync("./vid.mov").size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream("./vid.mov", { start, end });

        // Stream the video chunk to the client
        videoStream.pipe(res);
      });

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
