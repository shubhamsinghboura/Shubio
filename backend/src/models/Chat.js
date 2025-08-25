const mongoose= require('mongoose');

const chatSchema = new mongoose.Schema({
message: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);