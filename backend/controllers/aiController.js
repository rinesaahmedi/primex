const { openai, pineconeIndex } = require('../config/ai');

// BASE KNOWLEDGE PROMPT
const BASE_SYSTEM_PROMPT = `
You are the AI Support Assistant for PrimeX. Your goal is to be helpful, professional, and encourage users to book an appointment.

CORE INFORMATION:
- Company: PrimeX
- Services: AI Agents, Custom Software, Graphic Design, Admin Support.
- Tone: Professional, modern, concise, and friendly.

PRICING:
- Tell them: "Our pricing depends on the complexity of the project. We offer custom quotes tailored to your needs."

CALL TO ACTIONS:
- "Would you like to book a free consultation?"
- "You can apply to work with us on our Apply page."
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
        { role: "user", content: message }
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
        audioBase64 = buffer.toString('base64');
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
    const audioBase64 = buffer.toString('base64');

    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error("TTS Error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
};

// Make sure to add it to the exports!
module.exports = { handleChat, generateSpeechOnly };