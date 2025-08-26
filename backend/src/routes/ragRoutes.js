// routes/ragRoutes.js
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth"); // DOCX parser
const Tesseract = require("tesseract.js"); // OCR for images & scanned PDFs
const fetch = require("node-fetch"); // for link upload
const { addDocument } = require("../utils/Rag");

const router = express.Router();
const upload = multer(); // memory storage

// 📝 Document Upload (PDF, DOCX, TXT)
router.post("/upload/document", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let text = "";

    switch (req.file.mimetype) {
      case "application/pdf":
        try {
          const data = await pdfParse(req.file.buffer);
          text = data.text;
          // If empty text, fallback to OCR
          if (!text.trim()) {
            console.log("PDF had no text, running OCR...");
            const result = await Tesseract.recognize(req.file.buffer, "eng");
            text = result.data.text;
          }
        } catch (err) {
          console.error("PDF parse error:", err.message);
          return res.status(500).json({ error: "PDF parsing failed" });
        }
        break;

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        try {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          text = result.value;
        } catch (err) {
          console.error("DOCX parse error:", err.message);
          return res.status(500).json({ error: "DOCX parsing failed" });
        }
        break;

      case "text/plain":
        text = req.file.buffer.toString("utf8");
        break;

      default:
        return res.status(400).json({ error: "Unsupported document format" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "No extractable text found" });
    }

    try {
      await addDocument(text);
    } catch (err) {
      console.error("addDocument error:", err.message);
      return res.status(500).json({ error: "Failed to index document" });
    }

    res.json({ message: "✅ Document uploaded & indexed successfully" });
  } catch (error) {
    console.error("Document upload error:", error.message);
    res.status(500).json({ error: "Failed to process document" });
  }
});

// 🔗 Link Upload
router.post("/upload/link", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const response = await fetch(url);
    const html = await response.text();

    // Extract text from HTML (basic)
    const text = html.replace(/<[^>]*>/g, " ");

    if (!text.trim()) {
      return res.status(400).json({ error: "No extractable text in link" });
    }

    await addDocument(text);
    res.json({ message: "✅ Link content indexed successfully" });
  } catch (error) {
    console.error("Link upload error:", error.message);
    res.status(500).json({ error: "Failed to process link" });
  }
});

// 🖼️ Picture Upload (OCR)
router.post("/upload/picture", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const result = await Tesseract.recognize(req.file.buffer, "eng");
    const text = result.data.text;

    if (!text.trim()) {
      return res.status(400).json({ error: "No readable text in image" });
    }

    await addDocument(text);
    res.json({ message: "✅ Image text extracted & indexed successfully" });
  } catch (error) {
    console.error("Image upload error:", error.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

const { queryRag } = require("../utils/Rag");

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await queryRag(question);
    res.json({ answer });
  } catch (error) {
    console.error("RAG query error:", error.message);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

module.exports = router;
