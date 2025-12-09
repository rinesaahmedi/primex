const path = require("path");
// Load env vars immediately
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");

// Import Routes
const aiRoutes = require("./routes/aiRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api", aiRoutes); // handles /api/chat
app.use("/api", calendarRoutes); // handles /api/available-slots & /api/book-appointment
app.use("/", formRoutes); // handles /send-apply-form & /send-business-inquiry


// 1. Serve static files from the build folder
// We use '../dist' because server.cjs is in 'backend', so we go up one level to find 'dist'
app.use(express.static(path.join(__dirname, '../dist')));

// 2. Catch-all route to serve index.html for any request not handled by your API
// This is critical for React Router to work when refreshing the page
// option 1 (Recommended: use Regex)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
