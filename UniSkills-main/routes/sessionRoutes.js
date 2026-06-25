const express = require('express');
const router = express.Router();
const { requestSession, acceptSession, completeSession } = require('../controllers/sessionController');
router.post('/request', requestSession);      
router.post('/accept', acceptSession);        
router.post('/complete', completeSession);    
module.exports = router;