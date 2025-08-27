const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai"); // ✅ added ChatOpenAI
const { MongoClient } = require("mongodb");

let vectorStore;
let embeddings;

async function initRag() {
  embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("✅ MongoDB connected for RAG");

  const db = client.db(process.env.MONGO_DB || "ragDB");
  const collection = db.collection(process.env.MONGO_COLLECTION || "documents");

  const docs = await collection.find({}).toArray();

  if (!docs.length) {
    console.log("⚠️ No documents found in MongoDB, initializing empty FAISS index");
    vectorStore = await FaissStore.fromTexts([], [], embeddings);
    return;
  }

  const texts = docs.map((d) => d.content || "");
  const metadatas = docs.map((d) => ({
    _id: d._id.toString(),
    source: d.source || "mongodb",
    ...d.metadata,
  }));

  vectorStore = await FaissStore.fromTexts(texts, metadatas, embeddings);

  console.log(`✅ RAG initialized with ${texts.length} docs in FAISS index`);
}

function getVectorStore() {
  if (!vectorStore) throw new Error("❌ RAG not initialized. Call initRag() first.");
  return vectorStore;
}

// Add new document
async function addDocument(text) {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB || "ragDB");
  const collection = db.collection(process.env.MONGO_COLLECTION || "documents");

  const result = await collection.insertOne({
    content: text,
    source: "api",
    metadata: {},
  });

  // Also add to FAISS immediately
  await vectorStore.addDocuments([
    { pageContent: text, metadata: { _id: result.insertedId.toString() } },
  ]);

  console.log("📄 Document added:", result.insertedId.toString());

  await client.close();
}

// Query RAG
async function queryRag(question) {
  const vs = getVectorStore();
  const results = await vs.similaritySearch(question, 3); // 3 most relevant docs
  const context = results.map(r => r.pageContent).join("\n");

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  const response = await model.invoke([
    { role: "system", content: 'You are a helpful assistant. Use the context to answer.' },
    { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}\nAnswer:` }
  ]);

  return response.content;
}

module.exports = { initRag, getVectorStore, addDocument, queryRag };
