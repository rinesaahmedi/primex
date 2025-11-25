const path = require("path");
const { google } = require("googleapis");

const keyFile = path.join(__dirname, "../../keys/calendar-key.json"); // Adjust path to where your key is
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

module.exports = { getCalendarClient, MY_CALENDAR_ID };
