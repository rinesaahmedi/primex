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
const handleChat = async (req, res) => {
  const { message, includeAudio } = req.body;

  // Validate message parameter
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: "Message is required and must be a string." });
  }

  // Check if Pinecone index is initialized
  if (!pineconeIndex) {
    return res.status(500).json({ reply: "Database connection is not configured. Please check server environment variables (PINECONE_API_KEY)." });
  }

  try {
    // A. Create Embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", 
      input: message,
    });
    
    const vector = embeddingResponse.data[0].embedding;

    // B. Query Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: vector,
      topK: 3, 
      includeMetadata: true,
    });

    // C. Extract context
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text || "") 
      .join("\n\n---\n\n");

    // D. Build Prompt
    const finalSystemPrompt = `
      ${BASE_SYSTEM_PROMPT}
      Here is context from our database: ${contextText}
      If the context doesn't have the answer, use general knowledge.
    `;

    // E. Generate Text Answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    const replyText = completion.choices[0].message.content;
    let audioBase64 = null;

    // F. Generate Audio (If requested)
    if (includeAudio) {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "shimmer",
        input: replyText,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      audioBase64 = buffer.toString('base64');
    }

    // Send response
    res.json({ reply: replyText, audio: audioBase64 });

  } catch (error) {
    console.error("Chat API Error:", error); 
    res.status(500).json({ reply: "I'm having trouble connecting right now." });
  }
};

module.exports = { handleChat };