const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.get('/messages/:receiverId', authMiddleware, getMessages);

module.exports = router;