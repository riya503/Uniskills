const express = require('express');
const router = express.Router();
const { addSkill, getAllSkills } = require('../controllers/skillController');
router.post('/add', addSkill);
router.get('/all', getAllSkills);
module.exports = router;
