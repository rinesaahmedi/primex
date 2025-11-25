const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/aiController');
const { generateSpeechOnly } = require('../controllers/aiController');
// Define the POST route
router.post('/chat', handleChat);

router.post('/speak', generateSpeechOnly);

module.exports = router;