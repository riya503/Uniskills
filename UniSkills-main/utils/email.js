const nodemailer = require('nodemailer');
require('dotenv').config({ quiet: true });

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: `"UniSkills" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to UniSkills Ecosystem! 🚀',
            html: `
                <div style="font-family: Arial, sans-serif; background: #07090f; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #3b82f6;">
                    <h1 style="color: #60a5fa; text-align: center;">Welcome to UniSkills!</h1>
                    <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0;">
                        Hi <strong>${userName}</strong>,<br><br>
                        Welcome to UniSkills! We are so happy you joined us. This platform is made by students, for students. Here you can connect with mentors, share what you know, and build a good profile for your future.
                    </p>
                    <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-left: 4px solid #3b82f6; margin-top: 20px;">
                        <p style="margin: 0; color: #94a3b8;">
                            <strong>What to do next:</strong> Go to your profile, add your photo and resume, and try booking a session with someone!
                        </p>
                    </div>
                    <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #64748b;">
                        Sent automatically by UniSkills.<br>
                        Got questions? Just ask the AI on your dashboard.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("🟢 Welcome Email sent successfully: " + info.response);
        return true;
    } catch (error) {
        console.log("🔴 Error sending Welcome Email: ", error);
        return false;
    }
};
const sendSessionRequestEmail = async (mentorEmail, mentorName, studentName, topic, credits) => {
    try {
        const mailOptions = {
            from: `"UniSkills Mentorship" <${process.env.EMAIL_USER}>`,
            to: mentorEmail,
            subject: 'New Mentorship Request! 🔔',
            html: `
                <div style="font-family: Arial, sans-serif; background: #07090f; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #10b981;">
                    <h1 style="color: #34d399; text-align: center;">New Request Received</h1>
                    <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0;">
                        Hi <strong>${mentorName}</strong>,<br><br>
                        Guess what? <strong>${studentName}</strong> wants to book a mentorship session with you!
                    </p>
                    <div style="background: rgba(16, 185, 129, 0.1); padding: 15px; border-left: 4px solid #10b981; margin-top: 20px;">
                        <p style="margin: 5px 0; color: #94a3b8;"><strong>Topic:</strong> ${topic}</p>
                        <p style="margin: 5px 0; color: #94a3b8;"><strong>Credits they are paying:</strong> 🪙 ${credits}</p>
                    </div>
                    <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #64748b;">
                        Log in to your account to accept or reject this request.<br>
                        Sent by UniSkills.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("🟢 Session Request Email sent successfully: " + info.response);
        return true;
    } catch (error) {
        console.log("🔴 Error sending Session Request Email: ", error);
        return false;
    }
};

const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
    try {
        const mailOptions = {
            from: `"UniSkills Security" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Password Reset Request 🔐',
            html: `
                <div style="font-family: Arial, sans-serif; background: #07090f; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #ef4444;">
                    <h1 style="color: #f87171; text-align: center;">Reset Your Password</h1>
                    <p style="font-size: 16px; line-height: 1.5; color: #e2e8f0;">
                        Hi <strong>${userName}</strong>,<br><br>
                        Someone asked to reset your UniSkills password. If this was you, click the button below to change it. If it wasn't you, just ignore this email.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset My Password</a>
                    </div>
                    <p style="font-size: 14px; margin-top: 30px; text-align: center; color: #64748b;">
                        This link will stop working in 15 minutes.<br>
                        Sent by UniSkills.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("🟢 Password Reset Email sent successfully: " + info.response);
        return true;
    } catch (error) {
        console.log("🔴 Error sending Password Reset Email: ", error);
        return false;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendSessionRequestEmail,
    sendPasswordResetEmail
};
