const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/aiController');

// Define the POST route
router.post('/chat', handleChat);

module.exports = router;