const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Chat = require('../models/Chat');
const { queryRag } = require('../utils/Rag');

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let conversationHistory = { hitesh: [] };

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
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (!personas[persona]) return res.status(400).json({ error: 'Invalid persona' });

    if (!conversationHistory[persona]) conversationHistory[persona] = [];
    conversationHistory[persona].push({ role: 'user', content: message });

    // 🔹 If doc uploaded → get context
  let context = "";
if (docId) {
  context = await queryRag(message, docId); // pass docId of uploaded PDF
}
    const messages = [
      { role: 'system', content: personas[persona] },
      ...(context ? [{ role: 'system', content: `Relevant context from PDF:\n${context}` }] : []),
      ...conversationHistory[persona]
    ];

    const aiResponse = await openAi.chat.completions.create({
      model: "gpt-4.1-mini",
      messages
    });

    const replyAI = aiResponse?.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    conversationHistory[persona].push({ role: 'assistant', content: replyAI });

    // Save to DB
    const savedChat = await Chat.create({
      message,
      response: replyAI,
      persona
    });

    // ✅ Log the full saved document
console.log("📄 RAG context:", context);
console.log("📝 Messages sent to AI:", messages);
console.log("💾 Chat saved to DB:", savedChat);
    res.json({ replyAI });

  } catch (err) {
    console.error('❌ Chat error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
