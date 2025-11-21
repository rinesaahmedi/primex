const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const app = express();
const port = 5000;

// Middleware
app.use(require('cors')());
app.use(express.json());

// Path to your Service Account JSON key file
const keyFile = path.join(__dirname, '../keys/calendar-key.json');


// Create a JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile, // Path to the service account file
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'], // Read-only access to the calendar
});

// Create the Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth });

app.get('/api/available-slots', async (req, res) => {
  try {
    // Respect optional `date` query param (YYYY-MM-DD) and optional client timezone offset (minutes)
    const { date, tzOffset } = req.query;

    // Build time range for the query. If tzOffset is provided (minutes, as from Date.getTimezoneOffset()),
    // compute the UTC timestamps that correspond to the client's local start/end of day.
    let timeMin = new Date().toISOString();
    let timeMax = undefined;
    if (date) {
      // Parse date parts
      const parts = date.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        const offsetMinutes = tzOffset ? parseInt(tzOffset, 10) : 0; // tzOffset = UTC - local (in minutes)

        // Compute UTC milliseconds for client's local midnight and local end-of-day
        const localMidnightUtcMs = Date.UTC(year, month, day, 0, 0, 0) + offsetMinutes * 60 * 1000;
        const localEndUtcMs = Date.UTC(year, month, day, 23, 59, 59) + offsetMinutes * 60 * 1000;

        timeMin = new Date(localMidnightUtcMs).toISOString();
        timeMax = new Date(localEndUtcMs).toISOString();
      }
    }

    // Query Google Calendar for events in the time range
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // If no events, return default working hours
    if (events.length === 0) {
      return res.json(['9:00', '10:00', '11:00', '13:15', '14:00', '15:00']);
    }

    // Compute available slots and return as an array
    const availableSlots = getAvailableTimeSlots(events);
    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});

// Simple booking endpoint - stores booking in memory (for demo)
const bookings = [];
app.post('/api/book-appointment', (req, res) => {
  const { name, email, date, time } = req.body || {};
  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  // In a real app you would validate and persist the booking (DB or Google Calendar insert).
  bookings.push({ name, email, date, time, createdAt: new Date().toISOString() });
  console.log('New booking:', bookings[bookings.length - 1]);
  return res.json({ message: 'Booking confirmed' });
});

// Function to calculate available time slots from fetched events
function getAvailableTimeSlots(events) {
  // Generate candidate slots (hourly) between workStart and workEnd and remove any that overlap events
  const availableSlots = [];
  const workStartHour = 9; // 9:00
  const workEndHour = 17; // 17:00 (slots generated until this hour)
  const slotDurationMinutes = 30; // 30-minute slots

  // Helper to format time strings
  const fmt = (d) => {
    const hh = d.getHours();
    const mm = d.getMinutes();
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  };

  // Determine the date used by the events (if events span multiple days, slots are generated per-day by the caller)
  // We'll build slots for the day of the first event if possible; otherwise use today's date.
  let baseDate = new Date();
  if (events.length > 0) {
    const ev = events[0];
    const s = ev.start && (ev.start.dateTime || ev.start.date);
    if (s) baseDate = new Date(s);
  }

  // Create candidate slot start times in local server timezone for the baseDate
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  // step through the day in increments of slotDurationMinutes
  for (let minutes = workStartHour * 60; minutes < workEndHour * 60; minutes += slotDurationMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const slotStart = new Date(year, month, day, h, m, 0);
    const slotEnd = new Date(slotStart.getTime() + slotDurationMinutes * 60 * 1000);

    // Check overlap with any event
    let overlaps = false;
    for (const event of events) {
      const evStartStr = event.start && (event.start.dateTime || event.start.date);
      const evEndStr = event.end && (event.end.dateTime || event.end.date);
      if (!evStartStr || !evEndStr) {
        // If event has no times, treat as full-day busy
        overlaps = true;
        break;
      }

      const evStart = new Date(evStartStr);
      const evEnd = new Date(evEndStr);

      // If the event and the slot overlap, mark it busy
      if (evStart < slotEnd && evEnd > slotStart) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      availableSlots.push(fmt(slotStart));
    }
  }

  return availableSlots;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
