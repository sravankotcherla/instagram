const express = require("express");
const fs = require("fs");
const cron = require("node-cron");

const filePath = "./images";

const clearMediaCache = () => {
  console.log("Running clear media cache job at ", Date.now().toJSON());
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log("Failed to read images directory");
    } else {
      files.forEach((file) => {
        const relPath = filePath + "/" + file;
        fs.stat(relPath, (error, stats) => {
          if (error) {
            console.log("Failed to get stats for the file ", file);
          } else {
            const timeDiff = (Date.now() - stats.mtime) / (60 * 1000);
            const threshold = process.env.MEDIA_CACHE_CLEAR_TIMEOUT || 30;
            if (timeDiff >= threshold) {
              fs.rm(relPath, (err) => {
                if (err) {
                  console.log("Failed to delete ", file);
                } else {
                  console.log(
                    "Cleared the file ",
                    file,
                    " by clearMediaCacheJob at ",
                    Date.now().toJSON()
                  );
                }
              });
            }
          }
        });
      });
    }
  });
};

const clearMediaCacheJob = cron.schedule("*/30 * * * *", clearMediaCache);

module.exports = { clearMediaCacheJob };
