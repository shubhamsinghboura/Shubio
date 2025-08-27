const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Document", DocumentSchema);
