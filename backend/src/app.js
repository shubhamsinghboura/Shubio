const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ragRoutes = require("./routes/ragRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/rag", ragRoutes);
app.use("/api", chatRoutes);

app.get("/", (req, res) => res.send("🚀 API Server Running"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
