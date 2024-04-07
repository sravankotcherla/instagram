const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url:
    process.env.MONGO_URI ||
    "mongodb+srv://sravan:sravan@cluster0.wefff7s.mongodb.net/?retryWrites=true&w=majority",
  file: (req, file) => {
    return {
      bucketName: "media",
      filename: file.originalname || "postImage" + Date.now(),
    };
  },
});

const upload = multer({ storage });
const async = require("async");
const fs = require("fs");

const hostMedia = (files, callback) => {
  try {
    var db = mongoose.connections[0].db;
    const gridFsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "media",
    });
    async.concat(
      files,
      (file, cb) => {
        if (fs.existsSync(`./images/${file.name}`)) {
          return cb(null, file);
        }
        const writeStream = fs.createWriteStream(`./images/${file.name}`);
        gridFsBucket.openDownloadStreamByName(file.img).pipe(writeStream);
        writeStream.on("finish", () => {
          console.log("Image downloaded successfully");
          return cb(null, file);
        });
        writeStream.on("error", (err) => {
          console.log("Failed to write image", err);
          return cb(err);
        });
      },
      function (err, results) {
        if (err) {
          return callback(err);
        }
        return callback(null, results);
      }
    );
  } catch (err) {
    console.log("Failed to download image");
    return callback(err);
  }
};

module.exports = { upload, hostMedia };
