const path = require("path");

// Configure dotenv
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// --- 1. CONFIGURATIONS ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const keyFile = path.join(__dirname, "../keys/calendar-key.json");
const MY_CALENDAR_ID =
  "12f3606e67d25124ae81e80895f7c00c64cb0e705205ec0a0c67676c9a249d3d@group.calendar.google.com";

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

async function getCalendarClient() {
  const client = await auth.getClient();
  return google.calendar({ version: "v3", auth: client });
}

// --- 2. API: AVAILABLE SLOTS ---
app.get("/api/available-slots", async (req, res) => {
  try {
    const { date, tzOffset } = req.query;
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
});

function calculateSlots(year, month, day, offsetMinutes, events) {
  const slots = [];

  // Specific Start Times
  const definedTimes = [
    { h: 8, m: 0 },
    { h: 9, m: 0 },
    { h: 10, m: 0 },
    { h: 11, m: 0 },
    { h: 13, m: 15 },
    { h: 14, m: 15 },
    { h: 15, m: 15 },
  ];

  const duration = 60;

  for (const time of definedTimes) {
    const h = time.h;
    const m = time.m;

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

// --- 3. API: BOOK APPOINTMENT (With Styled Emails) ---
app.post("/api/book-appointment", async (req, res) => {
  try {
    // Added phone and topic here
    const { name, email, phone, topic, date, time, tzOffset } = req.body;

    console.log(`\n--- NEW BOOKING REQUEST ---`);
    console.log(`User: ${name} | Topic: ${topic}`);

    // --- A. Calendar Logic ---
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
    const insertRes = await calendar.events.insert({
      calendarId: MY_CALENDAR_ID,
      resource: {
        summary: `Appointment: ${name}`,
        // Added details to calendar description
        description: `Topic: ${topic}\nPhone: ${phone}\nEmail: ${email}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      },
    });

    // --- B. Styled Email Templates ---

    // 1. Template for the CLIENT
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1e3a8a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Confirmed</h1>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
          <p style="color: #4b5563;">Thank you for booking an appointment with PrimEx. We have confirmed your slot.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>💼 Topic:</strong> ${topic}</p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If you need to reschedule, please contact us directly.
          </p>
          <p style="font-weight: bold; color: #1e3a8a;">The PrimEx Team</p>
        </div>
      </div>
    `;

    // 2. Template for the OWNER (You)
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #2563eb; padding: 15px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">New Booking Received</h2>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Client Name</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 8px 0; font-weight: bold;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td>
              <td style="padding: 8px 0; font-weight: bold;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Topic</td>
              <td style="padding: 8px 0; font-weight: bold; color: #1e3a8a;">${topic}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-top: 1px solid #e5e7eb;" colspan="2"></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
              <td style="padding: 8px 0; font-weight: bold;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
              <td style="padding: 8px 0; font-weight: bold;">${time}</td>
            </tr>
          </table>

          <div style="margin-top: 25px; text-align: center;">
            <a href="mailto:${email}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Email Client</a>
          </div>
        </div>
      </div>
    `;

    const userMailOptions = {
      from: `"PrimEx Appointments" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Appointment Confirmed - PrimEx",
      html: clientHtml, // Use HTML property
    };

    const ownerMailOptions = {
      from: `"PrimEx System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Appointment: ${name}`,
      html: ownerHtml, // Use HTML property
    };

    // --- C. Sending ---
    try {
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(ownerMailOptions);
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
