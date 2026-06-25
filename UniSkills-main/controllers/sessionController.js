const { Session, User, sequelize } = require('../models');
const { sendSessionRequestEmail } = require('../utils/email');
exports.requestSession = async (req, res) => {
    try {
        const { topic, mentorId, studentId, offeredCredits } = req.body;
        const student = await User.findByPk(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });
        if (student.credits < offeredCredits) {
            return res.status(400).json({ message: "You don't have enough credits for this." });
        }
        const session = await Session.create({
            topic, mentorId, studentId,
            creditsTransferred: offeredCredits,
            status: 'pending'
        });
        const mentor = await User.findByPk(mentorId);

                req.app.get('socketio').emit(`notification_${mentorId}`, { 
            type: 'NEW_REQUEST', 
            message: `${student.name} requested a session on ${topic}` 
        });

        if (mentor) {
            sendSessionRequestEmail(mentor.email, mentor.name, student.name, topic, offeredCredits);
        }

        res.status(201).json({ message: "Request sent!", session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.acceptSession = async (req, res) => {
    try {
        const { sessionId, mentorId } = req.body;
        const session = await Session.findByPk(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (session.mentorId !== mentorId) return res.status(403).json({ message: "Unauthorized. You are not the mentor." });
        if (session.status !== 'pending') return res.status(400).json({ message: "Session is not in pending state" });
        session.status = 'active';
        await session.save();
        req.app.get('socketio').emit(`notification_${session.studentId}`, { 
            type: 'SESSION_ACCEPTED', 
            message: `Your session on ${session.topic} was accepted and is now ACTIVE!` 
        });
        res.status(200).json({ message: "Session started!", session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.completeSession = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        const { sessionId } = req.body;
        const session = await Session.findByPk(sessionId, { transaction: t });
        if (!session) throw new Error("Session not found");
        if (session.status !== 'active') throw new Error("Session is not active to be completed");
        const student = await User.findByPk(session.studentId, { transaction: t });
        const mentor = await User.findByPk(session.mentorId, { transaction: t });
        if (student.credits < session.creditsTransferred) {
            throw new Error("Student does not have enough credits to complete the payment.");
        }
        student.credits -= session.creditsTransferred;
        await student.save({ transaction: t });
        mentor.credits += session.creditsTransferred;
        await mentor.save({ transaction: t });
        session.status = 'completed';
        await session.save({ transaction: t });
        await t.commit();
        req.app.get('socketio').emit(`notification_${session.studentId}`, { 
            type: 'SESSION_COMPLETED', message: `Session completed. -${session.creditsTransferred} credits from wallet.` 
        });
        req.app.get('socketio').emit(`notification_${session.mentorId}`, { 
            type: 'SESSION_COMPLETED', message: `Session completed. +${session.creditsTransferred} credits earned!` 
        });
        res.status(200).json({ message: "Session finished and credits transferred!", session, newMentorBalance: mentor.credits });
    } catch (error) {
        await t.rollback(); 
        res.status(500).json({ error: error.message });
    }
};
