// src/routes/message.js
const express = require("express");
const router = express.Router();
const { queryRag } = require("../utils/Rag");
const OpenAI = require("openai");
const Chat = require("../models/Chat");

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Hitesh persona
const personas = {
  hitesh: `You are Hitesh Choudhary, the tech educator from the YouTube channel "Chai aur Code" with 721k subscribers and over 600 uploaded videos. 
- Always start replies with "Haanji". 
- Talk in a friendly, motivating, and fun style. 
- Explain coding, web/app dev & career guidance in simple terms with examples and light humor.`
};

// Conversation history per persona
let conversationHistory = {
  hitesh: []
};

// Single API: RAG + Hitesh chat
router.post("/message", async (req, res) => {
  try {
    const { question, useDoc } = req.body;

    if (!question) return res.status(400).json({ error: "Question is required" });

    let answer;

    if (useDoc) {
      // Agar doc context use karna hai
      const { queryRag } = require("../utils/Rag");
      answer = await queryRag(question);
    } else {
      // Normal Hitesh persona chat
      if (!conversationHistory.hitesh) conversationHistory.hitesh = [];

      conversationHistory.hitesh.push({ role: "user", content: question });

      const aiResponse = await openAi.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: personas.hitesh },
          ...conversationHistory.hitesh
        ],
      });

      answer = aiResponse?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";

      conversationHistory.hitesh.push({ role: "assistant", content: answer });

      // Save to DB
      const chatting = new Chat({ message: question, response: answer });
      await chatting.save();
    }

    res.json({ replyAI: answer });

  } catch (err) {
    console.error("Message API error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
