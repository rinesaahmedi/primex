const express = require("express");
const router = express.Router();
const calendarController = require("../controllers/calendarController");

router.get("/available-slots", calendarController.getAvailableSlots);
router.post("/book-appointment", calendarController.bookAppointment);

module.exports = router;
