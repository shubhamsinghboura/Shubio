const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { MongoClient } = require("mongodb");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const fs = require("fs");
const OpenAI = require("openai");

let vectorStore;
let embeddings;

async function initRag() {
  embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // ✅ Agar FAISS pehle se saved hai to usko load karo
  if (fs.existsSync("./faiss_index")) {
    vectorStore = await FaissStore.load("./faiss_index", embeddings);
    console.log("✅ Loaded FAISS index from disk");
    return;
  }

  // ✅ Agar FAISS saved nahi hai to MongoDB se build karo
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  console.log("✅ MongoDB connected for RAG");

  const db = client.db(process.env.MONGO_DB || "ragDB");
  const collection = db.collection(process.env.MONGO_COLLECTION || "documents");

  const docs = await collection.find({}).toArray();

  if (!docs.length) {
    console.log("⚠️ No documents found, creating empty FAISS index");
    vectorStore = await FaissStore.fromTexts([], [], embeddings);
    await vectorStore.save("./faiss_index");
    return;
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  let allTexts = [];
  let allMetadatas = [];

  for (const d of docs) {
    const chunks = await textSplitter.splitText(d.content || "");
    allTexts.push(...chunks);
    allMetadatas.push(
      ...chunks.map(() => ({
        _id: d._id.toString(),
        source: d.source || "mongodb",
        ...d.metadata,
      }))
    );
  }

  vectorStore = await FaissStore.fromTexts(allTexts, allMetadatas, embeddings);

  // ✅ Save FAISS to disk
  await vectorStore.save("./faiss_index");

  console.log(`✅ RAG initialized with ${allTexts.length} chunks`);
}

function getVectorStore() {
  if (!vectorStore) throw new Error("❌ RAG not initialized. Call initRag() first.");
  return vectorStore;
}

// ✅ Add new document
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

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitText(text);

  await vectorStore.addDocuments(
    chunks.map((chunk) => ({
      pageContent: chunk,
      metadata: { _id: result.insertedId.toString() },
    }))
  );

  // ✅ Save updated FAISS to disk
  await vectorStore.save("./faiss_index");

  console.log("📄 Document added & FAISS updated:", result.insertedId.toString());

  await client.close();
}

async function queryRag(question) {
  const vs = getVectorStore();
  const results = await vs.similaritySearch(question, 3);

  let context = results.map((r) => r.pageContent).join("\n");

  const MAX_CHARS = 6000;
  if (context.length > MAX_CHARS) {
    context = context.slice(0, MAX_CHARS);
  }

  // ✅ use ChatOpenAI instead of OpenAI
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4.1-mini",
    temperature: 0,
  });

  const response = await model.invoke([
    {
      role: "system",
      content:
        'You are a helpful assistant. Use the provided context to answer. If irrelevant, say "Sorry, I don’t know."',
    },
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion: ${question}\nAnswer:`,
    },
  ]);

  return response.content;
}

module.exports = { initRag, getVectorStore, addDocument, queryRag };
