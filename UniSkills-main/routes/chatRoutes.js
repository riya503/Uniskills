const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getChatContacts, markMessagesAsSeen } = require('../controllers/chatController');
router.post('/send', sendMessage);
router.get('/history/:user1Id/:user2Id', getChatHistory);
router.get('/contacts/:userId', getChatContacts);
router.put('/mark-seen', markMessagesAsSeen);
module.exports = router;
