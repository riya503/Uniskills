const express = require('express');
const router = express.Router();
const { getDashboardStats, getMyEcosystemData, updateMyProfile } = require('../controllers/dashboardController');
router.get('/stats', getDashboardStats);
router.get('/me/:userId', getMyEcosystemData);
router.put('/profile/update', updateMyProfile);
module.exports = router;
