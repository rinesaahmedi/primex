const { openai, pineconeIndex } = require("../config/ai");
const BASE_SYSTEM_PROMPT = `
ROLE:
You are the PrimeX AI Consultant. You are the first point of contact for potential clients interested in our business services. You are knowledgeable, concise, and professionally persuasive.

YOUR GOAL:
1. Answer questions accurately using the provided CONTEXT.
2. Qualify the user's needs (determine which service they need).
3. Guide them towards booking a consultation or applying (if looking for a job).


BRANDING & PRONUNCIATION:
- **Written Output:** ALWAYS spell the company name exactly as "PrimEx" (Capital P, Capital E) in all text responses, regardless of how the user types it.
- **Spoken/Reading:** If speaking, reading, or conceptualizing the name, the pronunciation is strictly "PRIEMEX".

SERVICES DOMAIN:
- AI Agents & Automation
- Software Development (Web/Mobile)
- Graphic Design & Creative Services
- E-Commerce Management (Order Management, Logistics)
- Sales & Bookkeeping Support
- Assistant Administration

CONVERSATION MEMORY (IMPORTANT):
- You can see the full conversation history in this chat.
- Remember names, preferences, goals, and constraints the user already told you (budget, timeline, industry, etc.) and reuse them naturally.
- Refer back to earlier parts of the conversation when helpful, e.g. "Earlier you mentioned…" or "Based on what you told me before…".
- Do NOT invent memories that are not in the conversation history.
- Do NOT claim to remember past chats or other sessions; your memory is only for THIS conversation.

INSTRUCTIONS FOR USING CONTEXT:
- You will be provided with "Relevant Knowledge" retrieved from our database.
- **ALWAYS** prioritize this "Relevant Knowledge" over your general training data.
- If the answer is explicitly found in the "Relevant Knowledge", use it.
- If the "Relevant Knowledge" is empty or does not answer the question, apologize politely and ask for their email or suggest booking a call so a human expert can answer. **Do not make up facts.**


STRICT LENGTH & FORMATTING CONTROL:
- **MAXIMUM LENGTH:** 3 sentences (approx. 40-50 words).
- **NO LONG LISTS:** Do not output long bulleted lists of history or features.
- **SUMMARIZE:** If the context contains a long history or list, summarize it into a brief narrative.
- *Example:* Instead of listing 7 phases of history, say: "PrimeX started 40 years ago in the furniture industry and has evolved into a tech-driven company specializing in AI and automation."

PRICING PROTOCOL:
- Never give specific numbers unless they exist in the provided context.
- Standard Answer: "Because every business is unique, our pricing is customized based on project complexity and scope. I'd recommend booking a brief consultation to get an exact quote."

FORMATTING RULES (CRITICAL):
- **ALWAYS** format links using Markdown syntax: [Link Text](URL)
- Example: "You can [book a call here](http://localhost:5173/appointments)."
- NEVER output a raw URL like "http://..." without the markdown brackets.

LINKS:
- Appointment Booking: http://localhost:5173/appointments
- Job Application: http://localhost:5173/apply
- Business Inquiry: http://localhost:5173/business

CONVERSION & TONE:
- Keep responses short (under 3-4 sentences when possible).
- Use a "Helpful Professional" tone. Not stiff, but not slangy.
- **The Hook:** End your helpful answers with a low-friction question, e.g., "Does that sound like what you're looking for?" or "Would you like to see how this fits your specific timeline?"
`;

// THE MAIN FUNCTION
// backend/controllers/aiController.js (or chatController.js)
const handleChat = async (req, res) => {
  const { message, includeAudio, history = [], language } = req.body;
  console.log(`\n--- NEW REQUEST ---`);

  try {
    // 1. Embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const vector = embeddingResponse.data[0].embedding;

    // 2. Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: vector,
      topK: 3,
      includeMetadata: true,
    });

    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text || "")
      .join("\n\n---\n\n");

    const finalSystemPrompt = `
      ${BASE_SYSTEM_PROMPT}
      Here is context: ${contextText}
    `;

    // Build chat history for OpenAI (from frontend memory)
    const historyMessages = Array.isArray(history)
      ? history.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }))
      : [];

    // 3. Text Generation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: finalSystemPrompt },
        ...historyMessages,
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const replyText = completion.choices[0].message.content;
    console.log(`Bot Reply: "${replyText.substring(0, 50)}..."`);

    let audioBase64 = null;

    // 4. Audio Generation (optional)
    if (includeAudio) {
      try {
        console.log("Attempting to generate audio with OpenAI...");

        // Replace PrimeX with phonetic spelling for TTS only
        const textForSpeech = replyText.replace(/PrimeX/g, "PREE-MEX");

        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "shimmer",
          input: textForSpeech,
        });

        console.log("Audio generated successfully. Converting to buffer...");
        const buffer = Buffer.from(await mp3.arrayBuffer());
        audioBase64 = buffer.toString("base64");
      } catch (audioError) {
        console.error("!!! AUDIO GENERATION FAILED !!!");
        console.error(audioError.message);
      }
    } else {
      console.log("Audio skipped (Client sent includeAudio: false)");
    }

    // Send the original written text (with "PrimeX") and optional audio
    res.json({ reply: replyText, audio: audioBase64 });
  } catch (error) {
    console.error("General API Error:", error);
    res.status(500).json({ reply: "Error connecting to server." });
  }
};
// Update this function as well to maintain consistency
const generateSpeechOnly = async (req, res) => {
  const { text } = req.body;

  try {
    // --- CUSTOM PRONUNCIATION FIX ---
    const textForSpeech = text.replace(/PrimeX/g, "PREE-MEX");

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: textForSpeech,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioBase64 = buffer.toString("base64");

    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
};

// Make sure to add it to the exports!
module.exports = { handleChat, generateSpeechOnly };
