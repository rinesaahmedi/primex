const express = require("express");
const router = express.Router();

// Import the controller
const aiController = require("../controllers/aiController");

// Check if the function exists before using it (Helps debugging)
if (!aiController.handleChat) {
  console.error(
    "Error: aiController.handleChat is undefined. Check aiController.js exports."
  );
}

router.post("/chat", aiController.handleChat);

module.exports = router;
