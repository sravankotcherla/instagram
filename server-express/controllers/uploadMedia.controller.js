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

module.exports = { upload };
