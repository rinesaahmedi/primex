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
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api", aiRoutes); // handles /api/chat
app.use("/api", calendarRoutes); // handles /api/available-slots & /api/book-appointment
app.use("/", formRoutes); // handles /send-apply-form & /send-business-inquiry

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});