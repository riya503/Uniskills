const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Skill = sequelize.define('Skill', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Technology',
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 50
    },
    mentorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
module.exports = Skill;