const path = require("path");

// Configure dotenv to find .env file in root/server or root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const multer = require("multer");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// --- 1. EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Ensure this is the 16-char App Password
  },
});

// --- 2. GOOGLE CALENDAR CONFIGURATION ---
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

// ==================================================================
// ROUTE 1: GET AVAILABLE SLOTS (Calendar)
// ==================================================================
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
  // Define your working hours here
  const definedTimes = [
    { h: 8, m: 0 },
    { h: 10, m: 0 },
    { h: 14, m: 0 },
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

// ==================================================================
// ROUTE 2: BOOK APPOINTMENT (Calendar + Email)
// ==================================================================
app.post("/api/book-appointment", async (req, res) => {
  try {
    const { name, email, phone, topic, date, time, tzOffset } = req.body;

    // A. Insert into Google Calendar
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
        description: `Topic: ${topic}\nPhone: ${phone}\nEmail: ${email}`,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
      },
    });

    // B. Send Emails
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Appointment Confirmed</h2>
        <p>Hello ${name}, your appointment with PrimEx is confirmed.</p>
        <p><strong>Date:</strong> ${date} at ${time}</p>
        <p><strong>Topic:</strong> ${topic}</p>
      </div>
    `;

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking</h2>
        <p><strong>Client:</strong> ${name} (${email})</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        <p><strong>Date:</strong> ${date} at ${time}</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"PrimEx Appointments" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Appointment Confirmed",
        html: clientHtml,
      });
      await transporter.sendMail({
        from: `"PrimEx System" <${process.env.SMTP_USER}>`,
        to: process.env.OWNER_EMAIL,
        replyTo: email,
        subject: `New Appointment: ${name}`,
        html: ownerHtml,
      });
    } catch (emailErr) {
      console.error("Booking Email Error:", emailErr);
    }

    res.json({ message: "Booking successful!", eventId: insertRes.data.id });
  } catch (error) {
    console.error("Booking Server Error:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

// ==================================================================
// ROUTE 3: SEND APPLY FORM (With File Upload)
// ==================================================================
app.post("/send-apply-form", upload.single("cv"), async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      phone = "",
      linkedin = "",
      country = "",
      position = "Not specified", // NEW
      description = "",
      privacyAccepted = "false",
    } = req.body;

    const isPrivacyAccepted =
      privacyAccepted === "true" || privacyAccepted === "1";

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #111;">
        <div style="background:#2563eb;padding:12px;border-radius:8px 8px 0 0;color:#fff;text-align:center;">
          <h3 style="margin:0">New Job Application</h3>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:18px;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;color:#333;">
            <tr><td style="padding:8px;color:#6b7280;width:120px;">Position</td><td style="padding:8px;font-weight:700;color:#2563eb;font-size:16px;">${position}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Name</td><td style="padding:8px;font-weight:700">${name}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Email</td><td style="padding:8px;font-weight:700"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
            <tr><td style="padding:8px;color:#6b7280">Phone</td><td style="padding:8px;font-weight:700">${phone}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">LinkedIn</td><td style="padding:8px;font-weight:700">${linkedin}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Country</td><td style="padding:8px;font-weight:700">${country}</td></tr>
            <tr><td colspan="2" style="padding-top:12px;color:#6b7280">Message</td></tr>
            <tr><td colspan="2" style="padding:8px 0 0 0">${
              description
                ? description
                : '<span style="color:#9ca3af">(no description)</span>'
            }</td></tr>
          </table>
        </div>
      </div>
    `;

    // Send emails
    try {
      await transporter.sendMail(ownerMailOptions);
      if (email) {
        await transporter.sendMail({
          from: `"PrimEx Careers" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "We received your application",
          html: applicantHtml,
        });
      }
    } catch (mailErr) {
      console.error("Email send error:", mailErr);
      // We log the error but still return success to the frontend if the process mostly worked
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("/send-apply-form error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================================================================
// ROUTE 4: BUSINESS INQUIRY FORM
// ==================================================================
app.post("/send-business-inquiry", async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      businessType,
      website,
      message,
    } = req.body;

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #111;">
        <div style="background:#2563eb;padding:12px;border-radius:8px 8px 0 0;color:#fff;text-align:center;">
          <h3 style="margin:0">New Business Inquiry</h3>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:18px;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;color:#333;">
            <tr><td style="padding:8px;color:#6b7280;width:130px;">Company</td><td style="padding:8px;font-weight:700;font-size:16px;">${companyName}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Contact Person</td><td style="padding:8px;font-weight:700">${contactPerson}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Service Type</td><td style="padding:8px;font-weight:700;color:#2563eb;">${businessType}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Email</td><td style="padding:8px;font-weight:700"><a href="mailto:${email}" style="color:#2563eb">${email}</a></td></tr>
            <tr><td style="padding:8px;color:#6b7280">Phone</td><td style="padding:8px;font-weight:700">${phone}</td></tr>
            <tr><td style="padding:8px;color:#6b7280">Website</td><td style="padding:8px;font-weight:700">${
              website || "N/A"
            }</td></tr>
            <tr><td colspan="2" style="padding-top:12px;color:#6b7280">Inquiry Message</td></tr>
            <tr><td colspan="2" style="padding:8px 0 0 0;"><div style="background:#f9fafb;padding:12px;border-radius:4px;">${message}</div></td></tr>
          </table>
        </div>
      </div>
    `;

    // Send email to OWNER
    await transporter.sendMail({
      from: `"PrimEx Business" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email, // Allows you to just click "Reply" in Gmail
      subject: `Business Inquiry: ${companyName}`,
      html: ownerHtml,
    });

    // Send confirmation to CLIENT
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;color:#111;">
        <div style="background:#1e3a8a;padding:16px;border-radius:8px;color:#fff;text-align:center;"> 
          <h2 style="margin:0">Inquiry Received</h2>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:16px;border-radius:0 0 8px 8px;">
          <p>Dear ${contactPerson},</p>
          <p>Thank you for reaching out to PrimEx. We have received your inquiry regarding <strong>${businessType}</strong>.</p>
          <p>Our team will review your requirements and get back to you shortly.</p>
          <p>Best regards,<br/>PrimEx Business Team</p>
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"PrimEx Solutions" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "We received your inquiry - PrimEx",
        html: clientHtml,
      });
    } catch (err) {
      console.log("Could not send client confirmation email (optional step).");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("/send-business-inquiry error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
