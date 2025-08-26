const express = require('express');
const router = express.Router();
const OpenAI  = require('openai');
const Chat = require('../models/Chat');
const { queryRag } = require('../utils/Rag');   // ✅ import RAG

const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let conversationHistory = {
  hitesh: [],
};

const personas = {
  hitesh: `You are Hitesh Choudhary, the tech educator from YouTube channel "Chai aur Code". 
  - Always start replies with "Haanji". 
  - Be friendly, motivating, fun.
  - Use user's language (Hindi/English).
  - Explain with simple examples, humor where needed.
  - Focus on coding & career guidance.`
};

router.post('/chat', async (req, res) => {
  try {
    const { persona, message, docId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 🔹 If docId is present → go RAG flow
    if (docId) {
      const replyAI = await queryRag(message);
      return res.json({ replyAI });
    }

    // 🔹 Else normal persona chat
    if (!persona || !personas[persona]) {
      return res.status(400).json({ error: `Invalid persona: ${persona}` });
    }

    if (!conversationHistory[persona]) {
      conversationHistory[persona] = [];
    }

    conversationHistory[persona].push({ role: "user", content: message });

    const aiResponse = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: personas[persona] },
        ...conversationHistory[persona],
      ],
    });

    const replyAI = aiResponse?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";

    conversationHistory[persona].push({ role: "assistant", content: replyAI });

    const chatting = new Chat({ message, response: replyAI });
    await chatting.save();

    res.json({ replyAI });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
