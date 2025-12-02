const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");

// Endpoint to get available time slots for a specific day
router.get("/available-slots", calendarController.getAvailableSlots);

// Endpoint to get fully booked dates for the month
router.get("/unavailable-dates", calendarController.getUnavailableDates);

// Endpoint to book a new appointment
router.post("/book-appointment", calendarController.bookAppointment);

module.exports = router;