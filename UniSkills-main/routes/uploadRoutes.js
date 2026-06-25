const express = require('express');
const multer = require('multer');
const { User } = require('../models');
const { resumeStorage, profilePicStorage } = require('../config/cloudinary');

const router = express.Router();

const upload = multer({ 
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Please upload only PDF files for your resume.'), false);
    }
});

router.post('/resume', upload.single('resumePdf'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) return res.status(400).json({ error: "Please select a file first." });

                const cloudUrl = req.file.path; 

                const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found." });

                user.resumeUrl = cloudUrl;
        await user.save();

                res.status(200).json({ message: "Resume uploaded successfully!", resumeUrl: cloudUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const uploadImage = multer({ 
    storage: profilePicStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Please upload only image files (like JPG, PNG).'), false);
    }
});

router.post('/profile-pic', uploadImage.single('profilePic'), async (req, res) => {
    try {
        const { userId } = req.body;
        if (!req.file) return res.status(400).json({ error: "Please select an image first." });

                const cloudUrl = req.file.path; 

                const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found." });

                user.profilePic = cloudUrl;
        await user.save();

                res.status(200).json({ message: "Profile picture updated!", profilePic: cloudUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
