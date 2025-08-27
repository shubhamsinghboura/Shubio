const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { OpenAIEmbeddings } = require("@langchain/openai");

let vectorStore;

// ------------------------
// Initialize RAG
// ------------------------
async function initRag() {
  vectorStore = await FaissStore.fromTexts(
    ["Initial startup doc"],
    [{ id: 1 }],
    new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY })
  );
  console.log("✅ RAG initialized with FAISS");
}

// ------------------------
// Add document to RAG
// ------------------------
async function addDocument(content, type = "text") {
  if (!vectorStore) throw new Error("RAG not initialized");

  let text = content;
  if (!text || !text.trim()) throw new Error("No text to index");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(text);

  const docId = Date.now().toString(); // unique docId for this document

  await vectorStore.addDocuments(
    chunks.map((c, i) => ({
      pageContent: c,
      metadata: { chunk: i, docId } // store docId in metadata
    }))
  );

  console.log("📄 Document added to RAG, length:", text.length);
  return docId; // return docId to link with upload
}

// ------------------------
// Query RAG for context
// ------------------------
async function queryRag(question, docId = null) {
  if (!vectorStore) throw new Error("RAG not initialized");

  let results;

  if (docId) {
    // Only search chunks with this specific docId
    results = await vectorStore.similaritySearch(question, 3, {
      filter: (doc) => doc.metadata.docId === docId
    });
  } else {
    // Search all documents
    results = await vectorStore.similaritySearch(question, 3);
  }

  if (!results.length) return "❌ Sorry, I could not find relevant info in the document.";

  // Combine top chunks into context
  const context = results.map((r, i) => `Chunk ${i + 1}:\n${r.pageContent}`).join("\n\n");
  return context;
}

module.exports = { initRag, addDocument, queryRag, vectorStore };
