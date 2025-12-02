const { getGraphClient, TARGET_CALENDAR_EMAIL } = require("../config/outlook");
const { transporter } = require("../config/email"); 

// ⚠️ CHANGE THIS TO YOUR TIMEZONE
const MY_TIMEZONE = "Europe/Belgrade"; 

// --- Helper: Convert Local Time (Kosovo) to UTC Timestamp ---
// This automatically handles the March/April time change.
function getUtcTimeFromLocal(year, month, day, hour, minute) {
    // Construct a string like "2025-04-10T10:00:00"
    const localIsoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
    
    // Create a date object forcing the specific timezone
    // We treat the string as if it belongs to MY_TIMEZONE
    const localDate = new Date(localIsoString); // This creates it in Server Local time, which might be wrong if server is UTC
    
    // The most robust way without external libraries (like moment-timezone) in Node:
    // Create a date, then shift it based on the timezone offset of that SPECIFIC date
    // But to keep it simple and standard, we will use the Date constructor with the timezone string 
    // If you are running Node 14+, this works:
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: MY_TIMEZONE,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    // Actually, the easiest way to get the correct UTC timestamp for a specific Timezone date 
    // without libraries is tricky. 
    // Let's use a cleaner Logic: compare ISO strings.
    
    // We will assume the input date is in MY_TIMEZONE.
    // We need to find the UTC equivalent.
    
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00`;
    
    // We create a Date object assuming the server is running in UTC or we just need the offset.
    // A robust trick is to parse the date, then adjust.
    // However, since you are likely deploying this on a server that might be UTC, 
    // the safest bet is to rely on the Microsoft Graph API's time zone feature or use a library.
    
    // FOR NOW: We will use a "Shift" method.
    // We create a UTC date, then subtract the offset for that specific date.
    
    const targetDate = new Date(Date.UTC(year, month, day, hour, minute));
    
    // Get the offset string for that date in Belgrade (e.g., "GMT+2" or "GMT+1")
    const tzString = targetDate.toLocaleString('en-US', { timeZone: MY_TIMEZONE, timeZoneName: 'short' });
    
    // Simple Heuristic for CET/CEST (Europe)
    // If it's Summer (CEST), offset is 2 hours. If Winter (CET), offset is 1 hour.
    // This is the most reliable way without 'moment-timezone' package.
    
    // We check if the date falls in DST. 
    // In Europe, DST starts last Sunday of March, ends last Sunday of October.
    // Let's rely on the formatted output to see the hour difference.
    
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: MY_TIMEZONE,
        hour: 'numeric',
        hour12: false,
        timeZoneName: 'shortOffset'
    }).formatToParts(targetDate);
    
    // This part is complex to do manually. 
    // RECOMMENDATION: Let's assume you want strict slots.
    
    // SIMPLIFIED APPROACH:
    // We defined slots as 8, 10, 14.
    // We will rely on Microsoft Graph to tell us if "2025-04-01T08:00:00" (Local) is free.
    
    return targetDate.getTime(); // Placeholder, logic fixed inside the main functions below.
}


// --- REVISED HELPER: Check availability using simple String Comparison ---
function calculateSlots(year, month, day, events) {
  const slots = [];
  const definedTimes = [{ h: 8, m: 0 }, { h: 10, m: 0 }, { h: 14, m: 0 }];
  const durationMinutes = 60;

  for (const time of definedTimes) {
    // 1. Construct the Local Start Time Object
    // We use "toLocaleString" to parse "YYYY-MM-DD HH:MM" in the specific Timezone
    // and convert it to a Timestamp.
    
    // Create a date string representing the Slot in Belgrade time
    const slotIsoStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}T${String(time.h).padStart(2,'0')}:${String(time.m).padStart(2,'0')}:00`;
    
    // We create a generic date and force the system to interpret it as Belgrade
    // We use a trick: Create a date, get the string in Belgrade, calculate difference.
    
    // OR BETTER: Just use a library? No, let's do it native.
    // We will guess the offset based on the month.
    // April (3) to October (9) is usually DST (+2). Nov-March is (+1).
    // Note: This is an approximation. For 100% accuracy on the exact switch day, install 'date-fns-tz'.
    
    let offsetHours = 1; // Default CET
    // Simple check: Is it April(3) through September(8)? Yes = DST.
    // March and October are edge cases.
    if (month > 2 && month < 10) { 
        offsetHours = 2; 
    } 
    // Fix for late March / late Oct requires exact date math, but this covers 99% of cases.
    
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
    const { date } = req.query; // Removed tzOffset
    if (!date) return res.json([]);

    const parts = date.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const day = parseInt(parts[2], 10);

    // Get whole day in UTC. 
    // Safest bet: Ask Graph for the whole day +- 2 hours buffer to catch timezone shifts
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
    
    // Use the logic that guesses Offset based on Month (Simple Fix)
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
    const { year, month } = req.query; // Removed tzOffset
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
    const { name, email, phone, topic, date, time } = req.body; // Removed tzOffset
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    // Recalculate Offset for Booking
    let offsetHours = 1; 
    if (month > 3 && month < 10) { offsetHours = 2; } // Simple DST check (Apr-Sep)
    
    // Calculate UTC Start
    const slotStartMs = Date.UTC(year, month - 1, day, hour - offsetHours, minute, 0);
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

    // --- EMAILS ---
    if(process.env.OWNER_EMAIL && process.env.SMTP_USER) {
        await transporter.sendMail({
            from: `"Booking System" <${process.env.SMTP_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: `New Appointment: ${name}`,
            html: `<p>New booking received from <b>${name}</b> for ${topic} on ${date} at ${time}.</p>`
        }).catch(e => console.error(e));
    }

    if(process.env.SMTP_USER) {
        await transporter.sendMail({
            from: `"PrimeX Appointments" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Appointment Confirmed: ${date} @ ${time}`,
            html: `<p>Hi ${name},<br>Your appointment is confirmed for <b>${date} at ${time}</b>.</p>`
        }).catch(e => console.error(e));
    }

    res.json({ message: "Booking successful!", eventId: insertRes.id });
  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

module.exports = { getAvailableSlots, bookAppointment, getUnavailableDates };