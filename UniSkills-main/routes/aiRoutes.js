const express = require('express');
const router = express.Router();
const { chatWithMentor } = require('../controllers/aiController');
router.post('/chat', chatWithMentor);
module.exports = router;
