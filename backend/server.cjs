const path = require("path"); // Define this ONLY once at the very top

// Configure dotenv immediately using the path
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// --- 1. VERIFY CREDENTIALS ON STARTUP ---
console.log("------------------------------------------------");
console.log("Server Starting...");
console.log("Email User from .env:", process.env.SMTP_USER ? process.env.SMTP_USER : "MISSING!");
console.log("Email Pass from .env:", process.env.SMTP_PASS ? "Loaded (Hidden)" : "MISSING!");
console.log("Owner Email:", process.env.OWNER_EMAIL);
console.log("------------------------------------------------");

// --- 2. CONFIGURE EMAIL ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for Gmail SSL
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // MUST be the 16-char App Password
  },
});

// Verify connection immediately
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ EMAIL CONNECTION FAILED!");
    console.error(error);
    console.log("HINT: Did you use a Gmail App Password? standard passwords won't work.");
  } else {
    console.log("✅ Email Server is ready to send messages.");
  }
});

// --- 3. CONFIGURE CALENDAR ---
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

// --- API: AVAILABLE SLOTS ---
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
  const startHour = 9; 
  const endHour = 17;
  const duration = 60;

  for (let time = startHour * 60; time < endHour * 60; time += duration) {
    const h = Math.floor(time / 60);
    const m = time % 60;
    const slotStartMs = Date.UTC(year, month, day, h, m, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + duration * 60 * 1000;

    let isBusy = false;
    for (const event of events) {
      const evStart = new Date(event.start.dateTime || event.start.date).getTime();
      const evEnd = new Date(event.end.dateTime || event.end.date).getTime();
      if (evStart < slotEndMs && evEnd > slotStartMs) {
        isBusy = true; break;
      }
    }
    if (!isBusy) slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }
  return slots;
}

// --- API: BOOK APPOINTMENT ---
app.post("/api/book-appointment", async (req, res) => {
  try {
    const { name, email, date, time, tzOffset } = req.body;
    console.log(`\n--- NEW BOOKING REQUEST ---`);
    console.log(`User: ${name} (${email})`);

    // 1. Calculate Times
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const offsetMinutes = parseInt(tzOffset) || 0;

    const slotStartMs = Date.UTC(year, month - 1, day, hour, minute, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + 60 * 60 * 1000;

    const startIso = new Date(slotStartMs).toISOString();
    const endIso = new Date(slotEndMs).toISOString();

    // 2. Add to Google Calendar
    const calendar = await getCalendarClient();
    const insertRes = await calendar.events.insert({
      calendarId: MY_CALENDAR_ID,
      resource: {
        summary: `Appointment: ${name}`,
        description: `Client Email: ${email}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      },
    });
    console.log("✅ Google Calendar Event Created");

    // 3. Send Emails (Using Reply-To)
    const userMailOptions = {
      from: `"PrimEx Appointments" <${process.env.SMTP_USER}>`,
      to: email, 
      subject: "Appointment Confirmed - PrimEx",
      text: `Hello ${name},\n\nYour appointment is confirmed for ${date} at ${time}.\n\nThank you,\nPrimEx Team`,
    };

    const ownerMailOptions = {
      from: `"PrimEx System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email, // <--- This allows you to click Reply and email the client
      subject: `New Appointment: ${name}`,
      text: `New booking!\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}`,
    };

    // Await the email sending so we see errors in the log
    try {
      await transporter.sendMail(userMailOptions);
      console.log("✅ Email sent to Client");
      await transporter.sendMail(ownerMailOptions);
      console.log("✅ Email sent to Owner");
    } catch (emailErr) {
      console.error("❌ FAILED TO SEND EMAIL:", emailErr);
    }

    res.json({ message: "Booking successful!", eventId: insertRes.data.id });

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});