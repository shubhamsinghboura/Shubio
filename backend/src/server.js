require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initRag } = require("./utils/Rag");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1. Connect MongoDB (main app DB)
    await connectDB();

    // 2. Initialize RAG (load docs + build FAISS)
    await initRag();


    // 3. Start HTTP server
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
