const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple Chat Function
async function queryChat(message) {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("❌ queryChat Error:", error.message);
    throw error;
  }
}

module.exports = { queryChat };
