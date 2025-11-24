const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// WARNING: Ensure this path matches your actual file structure
// Your logs say "node server.cjs", so make sure this points to the right place.
const keyFile = path.join(__dirname, "../keys/calendar-key.json");

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

async function getCalendarClient() {
  const client = await auth.getClient();
  return google.calendar({ version: "v3", auth: client });
}

// HARDCODED CALENDAR ID
const MY_CALENDAR_ID =
  "12f3606e67d25124ae81e80895f7c00c64cb0e705205ec0a0c67676c9a249d3d@group.calendar.google.com";

// --- API ROUTE: AVAILABLE SLOTS ---
app.get("/api/available-slots", async (req, res) => {
  try {
    const { date, tzOffset } = req.query;
    console.log(`PARAMS RECEIVED -> Date: ${date}, Offset: ${tzOffset}`);

    if (!date) return res.json([]);

    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const clientOffsetMinutes = parseInt(tzOffset) || 0;

    const startOfDayMs =
      Date.UTC(year, month, day, 0, 0, 0) + clientOffsetMinutes * 60 * 1000;
    const endOfDayMs =
      Date.UTC(year, month, day, 23, 59, 59) + clientOffsetMinutes * 60 * 1000;

    const timeMin = new Date(startOfDayMs).toISOString();
    const timeMax = new Date(endOfDayMs).toISOString();

    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId: MY_CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} busy events on ${date}`);

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

function calculateSlots(year, month, day, offsetMinutes, events) {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  const duration = 60;

  const startTotalMins = startHour * 60;
  const endTotalMins = endHour * 60;

  for (let time = startTotalMins; time < endTotalMins; time += duration) {
    const h = Math.floor(time / 60);
    const m = time % 60;

    const slotStartMs =
      Date.UTC(year, month, day, h, m, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + duration * 60 * 1000;

    let isBusy = false;

    for (const event of events) {
      const evStart = new Date(
        event.start.dateTime || event.start.date
      ).getTime();
      const evEnd = new Date(event.end.dateTime || event.end.date).getTime();
      if (evStart < slotEndMs && evEnd > slotStartMs) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy) {
      const timeString = `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
}

// --- BOOKING ENDPOINT (FIXED) ---
app.post("/api/book-appointment", async (req, res) => {
  try {
    const { name, email, date, time, tzOffset } = req.body;
    console.log("Processing booking for:", { name, date, time });

    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const offsetMinutes = parseInt(tzOffset) || 0;

    const slotStartMs =
      Date.UTC(year, month - 1, day, hour, minute, 0) +
      offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + 60 * 60 * 1000;

    const startIso = new Date(slotStartMs).toISOString();
    const endIso = new Date(slotEndMs).toISOString();

    const calendar = await getCalendarClient();

    // --- FIX APPLIED HERE ---
    // We removed 'attendees' because Service Accounts cannot invite people
    // unless you pay for Google Workspace Enterprise.
    const insertRes = await calendar.events.insert({
      calendarId: MY_CALENDAR_ID,
      resource: {
        summary: `Appointment: ${name}`,
        description: `Booked via website.\nClient Email: ${email}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
        // attendees: [{ email }]  <-- REMOVED TO FIX ERROR
      },
    });

    console.log("Success! Event ID:", insertRes.data.id);
    res.json({ message: "Booking successful!", eventId: insertRes.data.id });
  } catch (error) {
    console.error("BOOKING FAILED:");
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    res
      .status(500)
      .json({ message: "Server Error: Could not book appointment." });
  }
});

app.get("/api/debug-token", async (req, res) => {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/send-business-inquiry", (req, res) => {
  console.log("Business Inquiry Received:", req.body);
  res.json({ success: true });
});

app.post("/send-apply-form", upload.single("cv"), (req, res) => {
  console.log("Application Received:", req.body);
  if (req.file) console.log("CV File attached:", req.file.originalname);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
