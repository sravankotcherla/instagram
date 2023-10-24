const express = require("express");
const next = require("next");
const mongoose = require("mongoose");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { homeRouter } = require("../server-express/home");
const { authRouter } = require("../server-express/routes/auth.routes");
const { checkAuth } = require("../server-express/controllers/auth.controller");

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
}

app
  .prepare()
  .then(() => {
    connectToDB(() => {
      const server = express();

      server.use("/auth", authRouter);

      // server.use("/", checkAuth);

      server.get("/api", (req, res) => {
        console.log("Hi");
        res.send("Api is working");
      });

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
