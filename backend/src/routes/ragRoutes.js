// routes/ragRoutes.js
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const fetch = require("node-fetch");
const { addDocument, queryRag } = require("../utils/Rag");
const { fromBuffer } = require("pdf2pic"); // npm install pdf2pic

const router = express.Router();
const upload = multer(); // memory storage

// ------------------------
// 📝 Document Upload (PDF, DOCX, TXT, Images)
// ------------------------
router.post("/upload/document", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";
    const mimetype = req.file.mimetype;

    // ------------------------
    // PDF
    // ------------------------
    if (mimetype === "application/pdf") {
      // Try normal PDF text extraction
      const data = await pdfParse(req.file.buffer);
      text = data.text;

      // If PDF is scanned (no text), convert first page to image & OCR
      if (!text.trim()) {
        try {
          const converter = fromBuffer(req.file.buffer, {
            density: 100,
            format: "png",
            width: 1200,
            height: 1600,
          });

          const pageImage = await converter(1); // first page
          const imageBuffer = Buffer.from(pageImage.base64, "base64");

          const result = await Tesseract.recognize(imageBuffer, "eng");
          text = result.data.text;
        } catch (ocrError) {
          console.error("OCR error on PDF:", ocrError.message);
        }
      }
    }

    // ------------------------
    // DOCX
    // ------------------------
    else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    }

    // ------------------------
    // TXT
    // ------------------------
    else if (mimetype === "text/plain") {
      text = req.file.buffer.toString("utf8");
    }

    // ------------------------
    // IMAGE (PNG, JPG, JPEG)
    // ------------------------
    else if (
      mimetype.startsWith("image/") &&
      ["image/png", "image/jpeg", "image/jpg"].includes(mimetype)
    ) {
      try {
        const result = await Tesseract.recognize(req.file.buffer, "eng");
        text = result.data.text;
      } catch (ocrError) {
        console.error("OCR error on image:", ocrError.message);
      }
    }

    // ------------------------
    // Unsupported file
    // ------------------------
    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!text.trim())
      return res.status(400).json({ error: "No readable text found in document" });

    // Add to RAG DB
    const docId = await addDocument(text);

    res.json({ message: "✅ Document uploaded & indexed successfully", docId });
  } catch (err) {
    console.error("Document upload error:", err.message);
    res.status(500).json({ error: "Failed to process document" });
  }
});

// ------------------------
// 🔗 Link Upload
// ------------------------
router.post("/upload/link", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const response = await fetch(url);
    const html = await response.text();
    const text = html.replace(/<[^>]*>/g, " "); // remove HTML tags

    if (!text.trim()) return res.status(400).json({ error: "No extractable text in link" });

    await addDocument(text);
    res.json({ message: "✅ Link content indexed successfully" });
  } catch (error) {
    console.error("Link upload error:", error.message);
    res.status(500).json({ error: "Failed to process link" });
  }
});

// ------------------------
// ❓ RAG Question Query
// ------------------------
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const answer = await queryRag(question);
    res.json({ answer });
  } catch (error) {
    console.error("RAG query error:", error.message);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

module.exports = router;
