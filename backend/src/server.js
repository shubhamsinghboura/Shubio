require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initRag } = require("./utils/Rag");
const fs = require("fs");
const DEFAULT_PORT = process.env.PORT || 5000;
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

(async () => {
  try {
    // 1. Connect MongoDB (main app DB)
    await connectDB();

    // 2. Initialize RAG (load docs + build FAISS)
    await initRag();

    // 3. Start HTTP server
    const server = http.createServer(app);

    function startServer(port) {
      server.listen(port)
        .on("listening", () => {
          console.log(`🚀 Server running on http://localhost:${port}`);
        })
        .on("error", (err) => {
          if (err.code === "EADDRINUSE") {
            console.warn(`⚠️ Port ${port} busy. Trying ${port + 1}...`);
            startServer(port + 1);
          } else {
            console.error("❌ Startup error:", err);
            process.exit(1);
          }
        });
    }

    startServer(DEFAULT_PORT);

  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
})();
