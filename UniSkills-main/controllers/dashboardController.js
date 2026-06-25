const User = require('../models/User');
const Skill = require('../models/Skill');
const Session = require('../models/Session');
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalSkills = await Skill.count();
        const totalSessions = await Session.count();
        res.status(200).json({
            success: true,
            totalUsers,
            totalSkills,
            totalSessions
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error fetching stats.' });
    }
};
const updateMyProfile = async (req, res) => {
    try {
        const { userId, bio, cgpa, phone } = req.body;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (bio) user.bio = bio;
        if (cgpa) user.cgpa = cgpa;
        if (phone) user.phone = phone;
        await user.save();
        res.status(200).json({ message: "Profile updated successfully!", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getMyEcosystemData = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            include: [
                { 
                    model: Session, 
                    as: 'mentoringSessions',
                    include: [{ model: User, as: 'student', attributes: ['id', 'name', 'bio', 'cgpa', 'phone', 'profilePic', 'resumeUrl'] }]
                },
                { 
                    model: Session, 
                    as: 'learningSessions',
                    include: [{ model: User, as: 'mentor', attributes: ['id', 'name', 'bio', 'cgpa', 'phone', 'profilePic', 'resumeUrl'] }]
                }
            ]
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({
            credits: user.credits,
            profilePic: user.profilePic,
            bio: user.bio,
            cgpa: user.cgpa,
            phone: user.phone,
            resumeUrl: user.resumeUrl,
            mentoringSessions: user.mentoringSessions,
            learningSessions: user.learningSessions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { getDashboardStats, getMyEcosystemData, updateMyProfile };
