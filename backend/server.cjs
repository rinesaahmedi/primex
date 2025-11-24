const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
// Helper to parse multipart forms (needed for the CV upload in JoinUsForm)
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Path to your Service Account JSON key file
const keyFile = path.join(__dirname, "../keys/calendar-key.json");

// Create a JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// --- CALENDAR SETUP ---
async function getCalendarClient() {
  const client = await auth.getClient();
  return google.calendar({ version: "v3", auth: client });
}

// --- API ROUTE: AVAILABLE SLOTS ---
app.get("/api/available-slots", async (req, res) => {
  try {
    // We need the date (YYYY-MM-DD) and the user's timezone offset (in minutes)
    const { date, tzOffset } = req.query;
    console.log(`PARAMS RECEIVED -> Date: ${date}, Offset: ${tzOffset}`);

    if (!date) return res.json([]);

    // 1. Parse the Date String manually to avoid server timezone issues
    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
    const day = parseInt(parts[2], 10);

    // 2. Calculate UTC boundaries for the requested day based on Client Offset
    // The client offset (e.g., -60 for GMT+1) needs to be added to UTC to align the query
    const clientOffsetMinutes = parseInt(tzOffset) || 0;

    // Start of day in Client Time -> converted to UTC milliseconds
    // Logic: Date.UTC gives us UTC midnight. We ADD the offset to shift it to Client Midnight.
    const startOfDayMs =
      Date.UTC(year, month, day, 0, 0, 0) + clientOffsetMinutes * 60 * 1000;
    const endOfDayMs =
      Date.UTC(year, month, day, 23, 59, 59) + clientOffsetMinutes * 60 * 1000;

    const timeMin = new Date(startOfDayMs).toISOString();
    const timeMax = new Date(endOfDayMs).toISOString();

    // 3. Hardcoded Calendar ID
    const calendarId =
      "12f3606e67d25124ae81e80895f7c00c64cb0e705205ec0a0c67676c9a249d3d@group.calendar.google.com";

    // 4. Fetch Events from Google
    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} busy events on ${date}`);

    // 5. Generate Available Slots
    // We pass the Year/Month/Day and Offset so we generate slots in Client Time
    const availableSlots = calculateSlots(
      year,
      month,
      day,
      clientOffsetMinutes,
      events
    );

    res.json(availableSlots);
  } catch (error) {
    console.error("Calendar API Error:", error);
    res.status(500).send("Error fetching events");
  }
});

// --- HELPER: SLOT CALCULATOR ---
function calculateSlots(year, month, day, offsetMinutes, events) {
  const slots = [];

  // CONFIGURATION: Working Hours
  const startHour = 9; // 9:00
  const endHour = 17; // 17:00
  const duration = 60; // 60 minute slots (9:00, 10:00, 11:00...)

  // Convert loops to minutes
  const startTotalMins = startHour * 60;
  const endTotalMins = endHour * 60;

  for (let time = startTotalMins; time < endTotalMins; time += duration) {
    const h = Math.floor(time / 60);
    const m = time % 60;

    // 1. Create the Candidate Slot Start/End in UTC (aligned to client timezone)
    // We take the base UTC time for that hour, then ADD the offset to match client reality
    const slotStartMs =
      Date.UTC(year, month, day, h, m, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + duration * 60 * 1000;

    // 2. Check for Overlaps
    let isBusy = false;

    for (const event of events) {
      // Google sends ISO strings. new Date() parses them correctly to absolute time.
      const evStart = new Date(
        event.start.dateTime || event.start.date
      ).getTime();
      const evEnd = new Date(event.end.dateTime || event.end.date).getTime();

      // Standard Overlap Logic: (StartA < EndB) and (EndA > StartB)
      if (evStart < slotEndMs && evEnd > slotStartMs) {
        isBusy = true;
        const timeStr = `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
        console.log(`  Blocked ${timeStr} due to: ${event.summary}`);
        break;
      }
    }

    // 3. If not busy, add to list
    if (!isBusy) {
      const timeString = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }

  return slots;
}

// --- OTHER API ENDPOINTS ---

// Booking Endpoint (creates a Google Calendar event)
const bookings = [];
app.post("/api/book-appointment", async (req, res) => {
  try {
    const { name, email, date, time, tzOffset } = req.body;
    console.log("Processing booking for:", { name, date, time });

    // 1. Parse Date and Time
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const offsetMinutes = parseInt(tzOffset) || 0;

    // 2. Calculate UTC Time
    // Create date at user's local time, then adjust by offset to get UTC
    const slotStartMs = Date.UTC(year, month - 1, day, hour, minute, 0) + (offsetMinutes * 60 * 1000);
    const slotEndMs = slotStartMs + (60 * 60 * 1000); // 1 Hour Duration

    const startIso = new Date(slotStartMs).toISOString();
    const endIso = new Date(slotEndMs).toISOString();

    // 3. Use Correct Calendar ID
    // REPLACE THIS WITH YOUR REAL ID
    const calendarId = "PASTE_YOUR_COPIED_ID_HERE"; 

    const calendar = await getCalendarClient();

    // 4. Insert Event
    const insertRes = await calendar.events.insert({
      calendarId,
      resource: {
        summary: `Appointment: ${name}`,
        description: `Email: ${email}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
        attendees: [{ email }], // Invites the user
      },
    });

    console.log("Success! Event ID:", insertRes.data.id);
    res.json({ message: "Booking successful!", eventId: insertRes.data.id });

  } catch (error) {
    // LOG THE REAL ERROR TO TERMINAL
    console.error("BOOKING FAILED:");
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Server Error: Check terminal for details." });
  }
});

// Debug Token Endpoint
app.get("/api/debug-token", async (req, res) => {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Business Inquiry Endpoint (Placeholder based on your frontend code)
app.post("/send-business-inquiry", (req, res) => {
  console.log("Business Inquiry Received:", req.body);
  // Add your email logic here later
  res.json({ success: true });
});

// Join Us / Apply Endpoint (Handles File Upload)
app.post("/send-apply-form", upload.single("cv"), (req, res) => {
  console.log("Application Received:", req.body);
  if (req.file) console.log("CV File attached:", req.file.originalname);
  // Add your email logic here later
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
