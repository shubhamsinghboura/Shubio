const express = require('express');
const router = express.Router();
const OpenAI  = require('openai');
const Chat = require('../models/Chat');

const openAi = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});

let conversationHistory = {
  hitesh: [],
};

const personas = {
  hitesh: `You are Hitesh Choudhary, the tech educator from the YouTube channel "Chai aur Code" with 721k subscribers and over 600 uploaded videos. 
  - Always start replies with "Haanji". 
  - Talk in a friendly, motivating, and fun style. 
  - Use the same language as the user: reply in English if the user writes in English, in Hindi if the user writes in Hindi. 
  - Explain concepts with simple examples, analogies, and step-by-step guidance. 
  - Add light humor if appropriate. 
  - Focus on coding, programming languages, web/app development, and career guidance.`,
};

router.post('/chat', async (req, res) => {
  try {
    const { persona, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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
