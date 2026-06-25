const { Skill, User } = require('../models');
exports.addSkill = async (req, res) => {
    try {
        const { name, category, credits, mentorId } = req.body;
        const newSkill = await Skill.create({
            name,
            category: category || "General",
            credits: credits || 50,
            mentorId
        });
        const populatedSkill = await Skill.findByPk(newSkill.id, {
            include: [{ model: User, as: 'mentor', attributes: ['id', 'name', 'email', 'resumeUrl', 'profilePic', 'bio', 'cgpa', 'phone'] }]
        });
        req.app.get('socketio').emit('new_skill_published', populatedSkill);
        res.status(201).json({ message: "Skill added successfully!", skill: populatedSkill });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll({
            include: [{ model: User, as: 'mentor', attributes: ['id', 'name', 'email', 'resumeUrl', 'profilePic', 'bio', 'cgpa', 'phone'] }]
        });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
