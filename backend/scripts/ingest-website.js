// scripts/ingest-website.js
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import puppeteer from "puppeteer";
import * as dotenv from "dotenv";
import path from "path";

// 1. Point to the .env file in the root folder
dotenv.config({ path: "../.env" });

const BASE_URL = "http://localhost:5173";
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX;

const paths = [
  "/",
  "/about",
  "/services/ai-agents",
  "/services/software-developer",
  "/services/graphic-designer",
  "/services/assistant-administrator",
  "/services/sales-bookkeeping",
  "/services/e-commerce",
  "/apply",
  "/business",
  "/terms",
  "/certificate",
  "/appointments",
];

const scrapeWebsite = async () => {
  console.log("🕷️  Spinning up browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const docs = [];

  for (const path of paths) {
    const fullUrl = `${BASE_URL}${path}`;
    console.log(`📄 Scraping: ${fullUrl}`);

    try {
      await page.goto(fullUrl, { waitUntil: "networkidle0" });

      const content = await page.evaluate(() => {
        const main = document.querySelector("main");
        return main ? main.innerText : document.body.innerText;
      });

      // --- 🧹 CLEANING STEP ---
      // 1. Replace multiple newlines with a single space
      let cleaned = content.replace(/\s+/g, " ").trim();

      // 2. Remove any "word" longer than 500 chars (likely Base64 or garbage code)
      // This is what caused your 40KB error!
      cleaned = cleaned
        .split(" ")
        .filter((word) => word.length < 500)
        .join(" ");

      if (cleaned.length > 50) {
        docs.push({
          pageContent: cleaned,
          metadata: {
            source: fullUrl,
          },
        });
      }
    } catch (error) {
      console.error(`❌ Error scraping ${fullUrl}:`, error.message);
    }
  }

  await browser.close();
  return docs;
};

const uploadToPinecone = async (rawDocs) => {
  if (rawDocs.length === 0) return console.log("⚠️ No docs found.");

  console.log("🔪 Splitting text into smaller chunks...");

  // --- ✂️ SPLITTING STEP ---
  // Reduced chunk size to 512 to ensure we never hit the 40KB metadata limit
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments(
    rawDocs.map((d) => d.pageContent),
    rawDocs.map((d) => d.metadata)
  );

  console.log(`💾 Uploading ${docs.length} chunks to Pinecone...`);

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

  // Embed and Store
  await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
    { pineconeIndex }
  );

  console.log("✅ Success! Website knowledge is now in the brain.");
};

const run = async () => {
  try {
    const rawDocs = await scrapeWebsite();
    await uploadToPinecone(rawDocs);
  } catch (err) {
    console.error("FATAL ERROR:", err);
  }
};

run();
