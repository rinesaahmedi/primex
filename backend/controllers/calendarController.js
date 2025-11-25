const { getCalendarClient, MY_CALENDAR_ID } = require("../config/calendar");
const { transporter } = require("../config/email");

// Helper function to calculate time slots
function calculateSlots(year, month, day, offsetMinutes, events) {
  const slots = [];
  // Define your working hours here
  const definedTimes = [
    { h: 8, m: 0 },
    { h: 10, m: 0 },
    { h: 14, m: 0 },
  ];
  const duration = 60; // 60 minutes

  for (const time of definedTimes) {
    const h = time.h;
    const m = time.m;

    // Calculate start/end in UTC based on the client's offset
    const slotStartMs =
      Date.UTC(year, month, day, h, m, 0) + offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + duration * 60 * 1000;

    let isBusy = false;
    for (const event of events) {
      const evStart = new Date(
        event.start.dateTime || event.start.date
      ).getTime();
      const evEnd = new Date(event.end.dateTime || event.end.date).getTime();

      // Check for overlap
      if (evStart < slotEndMs && evEnd > slotStartMs) {
        isBusy = true;
        break;
      }
    }

    if (!isBusy) {
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }
  return slots;
}

// ==================================================================
// 1. GET AVAILABLE SLOTS (Single Day)
// ==================================================================
const getAvailableSlots = async (req, res) => {
  try {
    const { date, tzOffset } = req.query;
    if (!date) return res.json([]);

    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[2], 10);
    const clientOffsetMinutes = parseInt(tzOffset) || 0;

    const startOfDayMs =
      Date.UTC(year, month, day, 0, 0, 0) + clientOffsetMinutes * 60 * 1000;
    const endOfDayMs =
      Date.UTC(year, month, day, 23, 59, 59) + clientOffsetMinutes * 60 * 1000;

    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId: MY_CALENDAR_ID,
      timeMin: new Date(startOfDayMs).toISOString(),
      timeMax: new Date(endOfDayMs).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const slots = calculateSlots(
      year,
      month,
      day,
      clientOffsetMinutes,
      response.data.items || []
    );
    res.json(slots);
  } catch (error) {
    console.error("Calendar Error:", error);
    res.status(500).send("Error fetching slots");
  }
};

// ==================================================================
// 2. GET UNAVAILABLE DATES (Whole Month) - NEW FUNCTION
// ==================================================================
const getUnavailableDates = async (req, res) => {
  try {
    const { year, month, tzOffset } = req.query;

    const targetYear = parseInt(year);
    const targetMonth = parseInt(month) - 1; // JS months are 0-11
    const clientOffsetMinutes = parseInt(tzOffset) || 0;

    // 1. Fetch all events for the entire month
    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endOfMonth = new Date(
      Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59)
    );

    const calendar = await getCalendarClient();
    const response = await calendar.events.list({
      calendarId: MY_CALENDAR_ID,
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const allEvents = response.data.items || [];
    const unavailableDates = [];

    // 2. Loop through every day of the month
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      // Calculate slots for this specific day
      const slots = calculateSlots(
        targetYear,
        targetMonth,
        day,
        clientOffsetMinutes,
        allEvents
      );

      // 3. If no slots are returned, mark this date as unavailable
      if (slots.length === 0) {
        const dateString = `${targetYear}-${String(targetMonth + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        unavailableDates.push(dateString);
      }
    }

    // Returns array like: ["2023-11-20", "2023-11-26"]
    res.json(unavailableDates);
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    res.status(500).send("Error calculating availability");
  }
};

// ==================================================================
// 3. BOOK APPOINTMENT
// ==================================================================
const bookAppointment = async (req, res) => {
  try {
    const { name, email, phone, topic, date, time, tzOffset } = req.body;
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const offsetMinutes = parseInt(tzOffset) || 0;

    const slotStartMs =
      Date.UTC(year, month - 1, day, hour, minute, 0) +
      offsetMinutes * 60 * 1000;
    const slotEndMs = slotStartMs + 60 * 60 * 1000;

    // Insert into Google Calendar
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

    // --- EMAIL TEMPLATES (Same as before) ---
    const ownerHtml = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #2563eb; padding: 20px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">New Booking Received</h2>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 35%;">Client Name</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 10px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Topic</td><td style="padding: 10px 0; color: #1e3a8a; font-weight: 700; font-size: 15px;">${topic}</td></tr>
            <tr><td colspan="2" style="border-bottom: 1px solid #f3f4f6; padding: 15px 0; margin-bottom: 15px;"></td></tr>
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Date</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${date}</td></tr>
            <tr><td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Time</td><td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 15px;">${time}</td></tr>
          </table>
          <div style="text-align: center; margin-top: 35px;">
            <a href="mailto:${email}" style="background-color: #2563eb; color: #ffffff; padding: 12px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">Email Client</a>
          </div>
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Appointment Confirmed</h2>
          <p style="color: #e0e7ff; margin: 5px 0 0;">You're all set!</p>
        </div>
        <div style="padding: 25px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Hi <strong>${name}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">Your appointment with PrimeX has been successfully scheduled.</p>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; color: #666; width: 80px;">Date:</td><td style="padding: 5px 0; font-weight: bold; color: #333;">${date}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Time:</td><td style="padding: 5px 0; font-weight: bold; color: #333;">${time}</td></tr>
              <tr><td style="padding: 5px 0; color: #666;">Topic:</td><td style="padding: 5px 0; font-weight: bold; color: #2563eb;">${topic}</td></tr>
            </table>
          </div>
          <p style="font-size: 14px; color: #666;">Please check your calendar for details. If you need to reschedule, please reply to this email.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} PrimeX. All rights reserved.</div>
      </div>
    `;

    // Send Emails
    await transporter.sendMail({
      from: `"PrimeX System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Appointment: ${name} (${date})`,
      html: ownerHtml,
    });

    await transporter.sendMail({
      from: `"PrimeX Appointments" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Appointment Confirmed: ${date} @ ${time}`,
      html: clientHtml,
    });

    res.json({ message: "Booking successful!", eventId: insertRes.data.id });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

// EXPORT FUNCTIONS
module.exports = {
  getAvailableSlots,
  bookAppointment,
  getUnavailableDates, // <--- DON'T FORGET TO EXPORT THIS
};
