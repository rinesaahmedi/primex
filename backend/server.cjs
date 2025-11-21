const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");
const app = express();
const port = 5000;

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
    // Get the events from the primary calendar
    const response = await calendar.events.list({
      calendarId: 'primary', // Your calendar ID (use 'primary' for your main calendar)
      timeMin: new Date().toISOString(), // Get events from now onwards
      maxResults: 10, // Fetch a limited number of events (for performance)
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Process events to show available slots (excluding events)
    const events = response.data.items;

    // If no events, all times are available
    if (events.length === 0) {
      return res.json({ availableSlots: ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00'] }); // Default working hours
    }

    // Process the events and find available time slots
    const availableSlots = getAvailableTimeSlots(events);

    // Send available slots to the frontend
    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
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
