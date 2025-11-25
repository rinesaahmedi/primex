const path = require("path");

// Configure dotenv to find .env file in root/server or root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });


// 1. Initialize Pinecone
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// 2. Connect to the Index
const index = pc.index('pdf-embeddings-index');

// 3. Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

// BASE KNOWLEDGE
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

// ==================================================================
// ROUTE: AI CHAT (WITH PINECONE RAG)
// ==================================================================
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // A. Create Embedding for user's query
    // We use text-embedding-3-small (newer) or text-embedding-ada-002
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", 
      input: message,
    });
    
    const vector = embeddingResponse.data[0].embedding;

    // B. Query Pinecone for relevant context
    const queryResponse = await index.query({
      vector: vector,
      topK: 3, // Get top 3 most relevant chunks
      includeMetadata: true,
    });

    // C. Extract context text from Pinecone results
    const contextText = queryResponse.matches
      .map((match) => match.metadata?.text || "") 
      .join("\n\n---\n\n");

    // D. Build the final prompt
    const finalSystemPrompt = `
      ${BASE_SYSTEM_PROMPT}

      Here is some specific context from our internal database that might help answer the user:
      ${contextText}

      If the context doesn't have the answer, use your general knowledge but mention you are not 100% sure.
    `;

    // E. Generate Answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Better and cheaper than 3.5
      messages: [
        { role: "system", content: finalSystemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("Chat API Error:", error); 
    res.status(500).json({ reply: "I'm having a little trouble connecting to my brain right now. Please try again in a moment." });
  }
});

// ==================================================================
// EMAIL & CALENDAR CONFIGURATION
// ==================================================================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});

const keyFile = path.join(__dirname, "../keys/calendar-key.json");
const MY_CALENDAR_ID = "12f3606e67d25124ae81e80895f7c00c64cb0e705205ec0a0c67676c9a249d3d@group.calendar.google.com";

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

async function getCalendarClient() {
  const client = await auth.getClient();
  return google.calendar({ version: "v3", auth: client });
}

// ==================================================================
// ROUTE: GET AVAILABLE SLOTS
// ==================================================================
app.get("/api/available-slots", async (req, res) => {
  try {
    const { date, tzOffset } = req.query;
    if (!date) return res.json([]);

    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const clientOffsetMinutes = parseInt(tzOffset) || 0;

    const startOfDayMs = Date.UTC(year, month, day, 0, 0, 0) + clientOffsetMinutes * 60 * 1000;
    const endOfDayMs = Date.UTC(year, month, day, 23, 59, 59) + clientOffsetMinutes * 60 * 1000;

    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId: MY_CALENDAR_ID,
      timeMin: new Date(startOfDayMs).toISOString(),
      timeMax: new Date(endOfDayMs).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const slots = calculateSlots(year, month, day, clientOffsetMinutes, response.data.items || []);
    res.json(slots);
  } catch (error) {
    console.error("Calendar Error:", error);
    res.status(500).send("Error fetching slots");
  }
});

function calculateSlots(year, month, day, offsetMinutes, events) {
  const slots = [];
  const definedTimes = [{ h: 8, m: 0 }, { h: 10, m: 0 }, { h: 14, m: 0 }];
  const duration = 60;

  for (const time of definedTimes) {
    const h = time.h;
    const m = time.m;
    const slotStartMs = Date.UTC(year, month, day, h, m, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + duration * 60 * 1000;

    let isBusy = false;
    for (const event of events) {
      const evStart = new Date(event.start.dateTime || event.start.date).getTime();
      const evEnd = new Date(event.end.dateTime || event.end.date).getTime();
      if (evStart < slotEndMs && evEnd > slotStartMs) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy) {
      const timeString = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
}

// ==================================================================
// ROUTE: BOOK APPOINTMENT
// ==================================================================
app.post("/api/book-appointment", async (req, res) => {
  try {
    const { name, email, phone, topic, date, time, tzOffset } = req.body;
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const offsetMinutes = parseInt(tzOffset) || 0;

    const slotStartMs = Date.UTC(year, month - 1, day, hour, minute, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + 60 * 60 * 1000;

    const calendar = await getCalendarClient();
    const insertRes = await calendar.events.insert({
      calendarId: MY_CALENDAR_ID,
      resource: {
        summary: `Appointment: ${name}`,
        description: `Topic: ${topic}\nPhone: ${phone}\nEmail: ${email}`,
        start: { dateTime: new Date(slotStartMs).toISOString() },
        end: { dateTime: new Date(slotEndMs).toISOString() },
      },
    });

    const clientHtml = `<h2>Confirmed</h2><p>${date} at ${time}</p>`;
    const ownerHtml = `<h2>New Booking</h2><p>${name} - ${topic}</p>`;

    await transporter.sendMail({
      from: `"PrimEx" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Appointment Confirmed",
      html: clientHtml,
    });
    await transporter.sendMail({
      from: `"PrimEx System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Appointment: ${name}`,
      html: ownerHtml,
    });

    res.json({ message: "Booking successful!", eventId: insertRes.data.id });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// ==================================================================
// ROUTE: SEND APPLY FORM (FIXED)
// ==================================================================
app.post("/send-apply-form", upload.single("cv"), async (req, res) => {
  try {
    const { name, email, phone, linkedin, country, position, description } = req.body;

    // 1. Define Email HTML for the Owner
    const ownerHtml = `
      <div style="font-family: Arial;">
        <h3>New Job Application</h3>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>LinkedIn:</strong> ${linkedin}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Message:</strong> ${description}</p>
      </div>
    `;

    // 2. Define Email HTML for the Applicant
    const applicantHtml = `
      <div style="font-family: Arial;">
        <h3>Application Received</h3>
        <p>Hi ${name}, thanks for applying to PrimEx for the ${position} role. We will review your CV and get back to you.</p>
      </div>
    `;

    // 3. Prepare Attachment (CV)
    const attachments = req.file ? [{
      filename: req.file.originalname,
      content: req.file.buffer
    }] : [];

    // 4. Send Email to Owner
    await transporter.sendMail({
      from: `"PrimEx Careers" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `New Application: ${name} - ${position}`,
      html: ownerHtml,
      replyTo: email,
      attachments: attachments // Attach the CV
    });

    // 5. Send Email to Applicant
    if (email) {
      await transporter.sendMail({
        from: `"PrimEx Careers" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your application",
        html: applicantHtml,
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("/send-apply-form error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================================================================
// ROUTE: BUSINESS INQUIRY FORM
// ==================================================================
app.post("/send-business-inquiry", async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, businessType, website, message } = req.body;

    const ownerHtml = `
      <h3>New Business Inquiry</h3>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Contact:</strong> ${contactPerson}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await transporter.sendMail({
      from: `"PrimEx Business" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `Business Inquiry: ${companyName}`,
      html: ownerHtml,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("/send-business-inquiry error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});