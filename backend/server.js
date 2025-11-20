const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Sample data of available times
const availableSlots = [
  "2025-11-21T10:00:00",
  "2025-11-21T11:00:00",
  "2025-11-21T14:00:00",
];

// API to get available slots
app.get("/api/available-slots", (req, res) => {
  res.json(availableSlots);
});

// API to book an appointment
app.post("/api/book-appointment", (req, res) => {
  const { time } = req.body;

  if (availableSlots.includes(time)) {
    // Here, you can add logic to remove the booked slot from availableSlots
    availableSlots.splice(availableSlots.indexOf(time), 1);
    res.status(200).json({ message: "Appointment booked successfully!" });
  } else {
    res.status(400).json({ message: "Time slot unavailable!" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
