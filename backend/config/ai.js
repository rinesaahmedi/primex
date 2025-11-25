const { Pinecone } = require("@pinecone-database/pinecone");
const OpenAI = require("openai");

// Ensure keys exist to prevent crashes
if (!process.env.PINECONE_API_KEY) console.warn("Missing PINECONE_API_KEY");
if (!process.env.OPENAI_API_KEY) console.warn("Missing OPENAI_API_KEY");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "placeholder",
});

const index = pc.index("pdf-embeddings-index");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "placeholder",
});

module.exports = { index, openai };
