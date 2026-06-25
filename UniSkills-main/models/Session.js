const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Session = sequelize.define('Session', {
  topic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  creditsTransferred: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' 
  }
});
module.exports = Session;
