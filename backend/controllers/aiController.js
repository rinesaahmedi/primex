const { openai, pineconeIndex } = require("../config/ai");
const BASE_SYSTEM_PROMPT = `
ROLE:
You are the PrimeX AI Consultant. You are the first point of contact for potential clients interested in our business services. You are knowledgeable, concise, and professionally persuasive.

YOUR GOAL:
1. Answer questions accurately using the provided CONTEXT.
2. Qualify the user's needs (determine which service they need).
3. Guide them towards booking a consultation or applying (if looking for a job).

SERVICES DOMAIN:
- AI Agents & Automation
- Software Development (Web/Mobile)
- Graphic Design & Creative Services
- E-Commerce Management (Order Management, Logistics)
- Sales & Bookkeeping Support
- Assistant Administration

INSTRUCTIONS FOR USING CONTEXT:
- You will be provided with "Relevant Knowledge" retrieved from our database.
- **ALWAYS** prioritize this "Relevant Knowledge" over your general training data.
- If the answer is explicitly found in the "Relevant Knowledge", use it.
- If the "Relevant Knowledge" is empty or does not answer the question, apologize politely and ask for their email or suggest booking a call so a human expert can answer. **Do not make up facts.**

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
  const { message, includeAudio } = req.body;
  console.log(`\n--- NEW REQUEST ---`);
  console.log(`User Message: "${message}"`);
  console.log(`Audio Requested? ${includeAudio}`);

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

    // 3. Text Generation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const replyText = completion.choices[0].message.content;
    console.log(`Bot Reply: "${replyText.substring(0, 50)}..."`);

    let audioBase64 = null;

    // 4. Audio Generation (DEBUGGING ADDED HERE)
    if (includeAudio) {
      try {
        console.log("Attempting to generate audio with OpenAI...");
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",
          voice: "shimmer",
          input: replyText,
        });

        console.log("Audio generated successfully. Converting to buffer...");
        const buffer = Buffer.from(await mp3.arrayBuffer());
        audioBase64 = buffer.toString("base64");
        console.log("Audio converted to Base64. Size:", audioBase64.length);
      } catch (audioError) {
        console.error("!!! AUDIO GENERATION FAILED !!!");
        console.error(audioError.message);
        // We do NOT crash the server; we just send text without audio
      }
    } else {
      console.log("Audio skipped (Client sent includeAudio: false)");
    }

    res.json({ reply: replyText, audio: audioBase64 });
  } catch (error) {
    console.error("General API Error:", error);
    res.status(500).json({ reply: "Error connecting to server." });
  }
};

// ... existing imports and handleChat code ...

// NEW FUNCTION: Generate Audio for existing text
const generateSpeechOnly = async (req, res) => {
  const { text } = req.body;

  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer",
      input: text,
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
