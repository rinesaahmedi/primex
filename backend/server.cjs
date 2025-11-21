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
    // Respect optional `date` query param (YYYY-MM-DD). If provided, fetch events only for that day.
    const { date } = req.query;

    // Build time range for the query
    let timeMin = new Date().toISOString();
    let timeMax = undefined;
    if (date) {
      // timeMin = start of the requested date (UTC)
      timeMin = new Date(`${date}T00:00:00Z`).toISOString();
      // timeMax = end of the requested date
      timeMax = new Date(`${date}T23:59:59Z`).toISOString();
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
  const availableSlots = [];
  const workStartTime = 9; // Assume work starts at 9 AM
  const workEndTime = 17; // Assume work ends at 5 PM

  let lastEndTime = workStartTime;

  // Loop through events and find available slots between events
  for (const event of events) {
    const eventStartTime = new Date(event.start.dateTime).getHours();
    const eventEndTime = new Date(event.end.dateTime).getHours();

    // Add available time slots between last event end time and current event start time
    for (let i = lastEndTime; i < eventStartTime; i++) {
      if (i < workEndTime) {
        availableSlots.push(`${i}:00`);
      }
    }

    // Update the last event end time
    lastEndTime = eventEndTime;
  }

  // Add available slots after the last event until work ends
  for (let i = lastEndTime; i < workEndTime; i++) {
    availableSlots.push(`${i}:00`);
  }

  return availableSlots;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
