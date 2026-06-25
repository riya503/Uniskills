const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/email');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists with this email." });

                const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        sendWelcomeEmail(newUser.email, newUser.name);

        res.status(201).json({ message: "User registered successfully!", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials. Wrong password." });
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET || 'supersecretkey_uniskills', 
            { expiresIn: '1h' }
        );
        res.status(200).json({ 
            message: "Login successful!", 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits,
                rating: user.rating
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "No account found with this email." });

        const { sendPasswordResetEmail } = require('../utils/email');
        const resetToken = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET || 'supersecretkey_uniskills', 
            { expiresIn: '15m' }
        );

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
        await sendPasswordResetEmail(user.email, user.name, resetLink);

        res.status(200).json({ message: "Password reset link sent to your email!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_uniskills');
        const user = await User.findByPk(decoded.id);

                if (!user) return res.status(404).json({ message: "User not found." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password has been successfully reset. You can now login." });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
        }
        res.status(500).json({ error: error.message });
    }
};
