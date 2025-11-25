const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Ensure environment variables are loaded before this runs (handled in server.cjs)

// 1. Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Connect to the specific Index
const pineconeIndex = pc.index('pdf-embeddings-index');

// 2. Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

// Export them so other files can use them
module.exports = { pineconeIndex, openai };