const { openai, index } = require("../config/ai");

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

// Define the function
const handleChat = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Create Embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const vector = embeddingResponse.data[0].embedding;

    // 2. Query Pinecone
    const queryResponse = await index.query({
      vector: vector,
      topK: 3,
      includeMetadata: true,
    });

    // 3. Extract Context
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text || "")
      .join("\n\n---\n\n");

    // 4. Build Prompt
    const finalSystemPrompt = `
      ${BASE_SYSTEM_PROMPT}
      Here is specific context: ${contextText}
      If the context doesn't have the answer, use general knowledge but mention you aren't 100% sure.
    `;

    // 5. Generate Answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat API Error:", error);
    res
      .status(500)
      .json({ reply: "I'm having trouble connecting to my brain right now." });
  }
};

// EXPORT IT EXPLICITLY
module.exports = {
  handleChat,
};
