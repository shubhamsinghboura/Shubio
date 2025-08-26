// backend/src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const messageRoutes = require("./routes/message"); // ✅ tera message API
const ragRoutes = require("./routes/ragRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", messageRoutes); // ✅ /api/message endpoint available

app.use("/rag", ragRoutes);

// Root
app.get("/", (req, res) => {
  res.send("🚀 API Server Running");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
