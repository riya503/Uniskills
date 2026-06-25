const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'student' 
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 100 
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0 
    },
    resumeUrl: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    bio: { type: DataTypes.TEXT, allowNull: true },
    cgpa: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    profilePic: { type: DataTypes.STRING, allowNull: true }
});
module.exports = User;
