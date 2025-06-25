const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
