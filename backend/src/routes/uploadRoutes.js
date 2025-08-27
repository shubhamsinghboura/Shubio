const express = require("express");
const multer = require("multer");
const { addDocument } = require("../utils/Rag");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const uploadDir = "uploads";

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

router.post("/upload/document", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let text = "";

    // Extract text based on mimetype
    if (req.file.mimetype === "application/pdf") {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(req.file.buffer);
      text = data.text;
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else if (req.file.mimetype === "text/plain") {
      text = req.file.buffer.toString("utf8");
    }

    if (!text || !text.trim()) return res.status(400).json({ error: "No extractable text found" });

    await addDocument(text); // pass the extracted text, not file path

    res.json({ message: "✅ Document uploaded & indexed successfully" });
  } catch (error) {
    console.error("Document upload error:", error.message);
    res.status(500).json({ error: "Failed to process document" });
  }
});

module.exports = router;
