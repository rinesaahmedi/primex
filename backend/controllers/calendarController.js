const { getGraphClient, TARGET_CALENDAR_EMAIL } = require("../config/outlook");
const { transporter } = require("../config/email"); 

// ⚠️ CHANGE THIS TO YOUR TIMEZONE
const MY_TIMEZONE = "Europe/Belgrade"; 

// --- Helper: Convert Local Time (Kosovo) to UTC Timestamp ---
function getUtcTimeFromLocal(year, month, day, hour, minute) {
    // We construct a UTC date, then subtract the offset for that specific date.
    // This is a simplified shift method.
    const targetDate = new Date(Date.UTC(year, month, day, hour, minute));
    return targetDate.getTime(); 
}

// --- Helper: Check availability using simple String Comparison ---
function calculateSlots(year, month, day, events) {
  const slots = [];
  const definedTimes = [{ h: 8, m: 0 }, { h: 10, m: 0 }, { h: 14, m: 0 }];
  const durationMinutes = 60;

  for (const time of definedTimes) {
    // Create a date string representing the Slot in Belgrade time
    // We will guess the offset based on the month (Simple DST logic for CET/CEST)
    let offsetHours = 1; // Default CET (Winter)
    
    // Simple check: Is it April(3) through September(8)? Yes = DST (+2).
    // March and October are edge cases, but this covers most scenarios.
    if (month > 2 && month < 10) { 
        offsetHours = 2; 
    } 
    
    // UTC Timestamp of the slot start
    const slotStartMs = Date.UTC(year, month, day, time.h - offsetHours, time.m, 0);
    const slotEndMs = slotStartMs + durationMinutes * 60 * 1000;

    let isBusy = false;
    
    for (const event of events) {
      // Microsoft always returns UTC times
      const evStart = new Date(event.start.dateTime + "Z").getTime(); // Ensure Z for UTC
      const evEnd = new Date(event.end.dateTime + "Z").getTime();
      
      if (evStart < slotEndMs && evEnd > slotStartMs) { 
        isBusy = true; 
        break; 
      }
    }
    
    if (!isBusy) {
        slots.push(`${time.h.toString().padStart(2, "0")}:${time.m.toString().padStart(2, "0")}`);
    }
  }
  return slots;
}

// 1. Get Available Slots
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; 
    if (!date) return res.json([]);

    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);

    // Get whole day in UTC with buffer
    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0) - 7200000); // -2 hours
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59) + 7200000); // +2 hours

    const client = await getGraphClient();

    const result = await client.api(`/users/${TARGET_CALENDAR_EMAIL}/calendarView`)
      .header("Prefer", 'outlook.timezone="UTC"')
      .query({ 
          startDateTime: startOfDay.toISOString(), 
          endDateTime: endOfDay.toISOString(), 
          $select: "subject,start,end" 
      })
      .get();
    
    const slots = calculateSlots(year, month, day, result.value || []);
    res.json(slots);
  } catch (error) { 
    console.error("Error getting slots:", error.message); 
    res.status(500).send("Error fetching slots"); 
  }
};

// 2. Get Unavailable Dates
const getUnavailableDates = async (req, res) => {
  try {
    const { year, month } = req.query; 
    const targetYear = parseInt(year);
    const targetMonth = parseInt(month) - 1;

    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
    const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));

    const client = await getGraphClient();

    const result = await client.api(`/users/${TARGET_CALENDAR_EMAIL}/calendarView`)
      .header("Prefer", 'outlook.timezone="UTC"')
      .query({ 
          startDateTime: startOfMonth.toISOString(), 
          endDateTime: endOfMonth.toISOString(), 
          $select: "subject,start,end", 
          $top: 999 
      })
      .get();

    const allEvents = result.value || [];
    const unavailableDates = [];
    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const slots = calculateSlots(targetYear, targetMonth, day, allEvents);
      if (slots.length === 0) { 
          unavailableDates.push(`${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`); 
      }
    }
    res.json(unavailableDates);
  } catch (error) { 
    console.error("Error getting dates:", error.message); 
    res.status(500).send("Error fetching unavailable dates"); 
  }
};

// 3. Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { name, email, phone, topic, date, time } = req.body;
    const [year, monthStr, day] = date.split("-").map(Number);
    const month = monthStr - 1; // JS months are 0-based
    const [hour, minute] = time.split(":").map(Number);

    // Recalculate Offset for Booking
    let offsetHours = 1; 
    if (month > 2 && month < 10) { offsetHours = 2; } // Simple DST check (Apr-Sep)
    
    // Calculate UTC Start
    const slotStartMs = Date.UTC(year, month, day, hour - offsetHours, minute, 0);
    const slotEndMs = slotStartMs + 60 * 60 * 1000;

    const client = await getGraphClient();

    const event = {
      subject: `Appointment: ${name}`,
      body: { 
          contentType: "HTML", 
          content: `<b>Topic:</b> ${topic}<br><b>Phone:</b> ${phone}<br><b>Email:</b> ${email}` 
      },
      start: { dateTime: new Date(slotStartMs).toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(slotEndMs).toISOString(), timeZone: "UTC" },
      attendees: [
          { emailAddress: { address: email, name: name }, type: "required" }
      ]
    };

    const insertRes = await client.api(`/users/${TARGET_CALENDAR_EMAIL}/events`).post(event);

    // --- 1. PREPARE EMAIL CONTENT ---
    
    // Common styles
    const containerStyle = `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #ffffff; color: #333333; line-height: 1.6;`;
    const headerStyle = `background-color: #0078D4; color: #ffffff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;`;
    const contentStyle = `padding: 20px;`;
    const tableStyle = `width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px;`;
    const tdLabelStyle = `padding: 10px; border-bottom: 1px solid #eeeeee; font-weight: bold; width: 30%; color: #555;`;
    const tdValueStyle = `padding: 10px; border-bottom: 1px solid #eeeeee; color: #333;`;
    const footerStyle = `margin-top: 20px; font-size: 12px; color: #999999; text-align: center; border-top: 1px solid #eeeeee; padding-top: 10px;`;

    // --- 2. SEND EMAIL TO OWNER (ADMIN) ---
    if (process.env.OWNER_EMAIL && process.env.SMTP_USER) {
        const ownerHtml = `
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <h2 style="margin:0;">New Appointment Request</h2>
                </div>
                <div style="${contentStyle}">
                    <p>Hello,</p>
                    <p>You have received a new booking via the <strong>PrimEx</strong> system.</p>
                    
                    <table style="${tableStyle}">
                        <tr>
                            <td style="${tdLabelStyle}">Client Name</td>
                            <td style="${tdValueStyle}">${name}</td>
                        </tr>
                        <tr>
                            <td style="${tdLabelStyle}">Topic</td>
                            <td style="${tdValueStyle}">${topic}</td>
                        </tr>
                        <tr>
                            <td style="${tdLabelStyle}">Date</td>
                            <td style="${tdValueStyle}">${date}</td>
                        </tr>
                        <tr>
                            <td style="${tdLabelStyle}">Time</td>
                            <td style="${tdValueStyle}">${time}</td>
                        </tr>
                        <tr>
                            <td style="${tdLabelStyle}">Email</td>
                            <td style="${tdValueStyle}"><a href="mailto:${email}" style="color:#0078D4;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="${tdLabelStyle}">Phone</td>
                            <td style="${tdValueStyle}">${phone}</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top:20px;">This event has been automatically added to your Outlook Calendar.</p>
                </div>
                <div style="${footerStyle}">
                    &copy; ${new Date().getFullYear()} PrimEx Appointments System
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"PrimEx System" <${process.env.SMTP_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: `📅 New Booking: ${name} - ${date}`,
            html: ownerHtml
        }).catch(e => console.error("Failed to send owner email:", e));
    }

    // --- 3. SEND CONFIRMATION TO CUSTOMER ---
    if (process.env.SMTP_USER) {
        const clientHtml = `
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <h2 style="margin:0;">Appointment Confirmed</h2>
                </div>
                <div style="${contentStyle}">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thank you for booking with PrimEx. Your appointment has been successfully scheduled.</p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078D4; padding: 15px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${date}</p>
                        <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${time}</p>
                        <p style="margin: 5px 0;"><strong>📝 Topic:</strong> ${topic}</p>
                    </div>

                    <p>If you need to reschedule or cancel, please contact us directly.</p>
                    <p>We look forward to speaking with you!</p>
                </div>
                <div style="${footerStyle}">
                    <p>PrimEx Appointments<br>
                    <em>Please do not reply to this automated email.</em></p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"PrimEx Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `✅ Appointment Confirmed: ${date} @ ${time}`,
            html: clientHtml
        }).catch(e => console.error("Failed to send client email:", e));
    }

    res.json({ message: "Booking successful!", eventId: insertRes.id });
  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

module.exports = { getAvailableSlots, bookAppointment, getUnavailableDates };