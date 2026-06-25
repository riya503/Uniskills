# UniSkills – Peer-to-Peer Skill Learning Platform

UniSkills is a full-stack web application designed to connect learners and mentors through a collaborative skill-sharing ecosystem. The platform enables users to teach, learn, and exchange knowledge while providing secure authentication, real-time communication, and an interactive learning experience.

## 🚀 Project Overview

The primary goal of UniSkills is to bridge the gap between individuals who want to learn new skills and those willing to share their expertise. Users can create profiles, showcase their skills, connect with other learners, and participate in virtual learning sessions.

The platform promotes collaborative learning by providing a seamless environment for communication, skill discovery, and knowledge exchange.

---

## ✨ Key Features

### User Management
- User Registration and Login
- Secure Authentication using JWT
- Password Encryption using bcrypt
- Profile Creation and Management

### Skill Matching System
- Add Skills Offered
- Add Skills Required
- Discover Relevant Learning Opportunities
- Connect with Users Based on Shared Interests

### Real-Time Communication
- Instant Messaging using Socket.IO
- Live User Interaction
- Real-Time Updates and Notifications

### Virtual Classroom
- Video and Audio Communication using WebRTC
- Interactive Online Learning Sessions
- Peer-to-Peer Collaboration

### Database Management
- Efficient Data Storage using SQLite
- Sequelize ORM for Database Operations
- Structured User and Skill Management

### Responsive Design
- Mobile-Friendly Interface
- Optimized User Experience Across Devices

---

## 🛠️ Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Axios

### Backend
- Node.js
- Express.js

### Database
- SQLite
- Sequelize ORM

### Authentication & Security
- JWT (JSON Web Token)
- bcrypt Password Hashing

### Real-Time Technologies
- Socket.IO
- WebRTC

### Development Tools
- Git
- GitHub
- Postman
- Visual Studio Code

---

## 🏗️ System Architecture

```text
User
  |
React Frontend
  |
Axios API Requests
  |
Node.js + Express.js
  |
Sequelize ORM
  |
SQLite Database

Real-Time Features
  |
Socket.IO + WebRTC
```

---

## 🔐 Authentication Flow

1. User registers with email and password.
2. Password is encrypted using bcrypt.
3. User logs in with valid credentials.
4. Server generates JWT token.
5. Token is used to access protected routes.
6. Unauthorized users are restricted from secure functionalities.

---

## 📡 API Functionalities

### Authentication APIs
- Register User
- Login User
- Verify JWT Token

### User APIs
- Update Profile
- Manage Skills
- View User Details

### Learning APIs
- Skill Matching
- Learning Requests
- Session Management

### Communication APIs
- Real-Time Chat
- Virtual Classroom Management

---

## 🎯 Challenges Solved

- Implemented secure authentication using JWT and bcrypt.
- Managed relational database operations with Sequelize ORM.
- Integrated Socket.IO for real-time communication.
- Established peer-to-peer virtual classrooms using WebRTC.
- Optimized application responsiveness and user experience.

---

## 📈 Future Enhancements

- AI-Based Skill Recommendations
- Course Creation and Management
- User Ratings and Reviews
- Session Scheduling System
- Push Notifications
- Learning Progress Tracking
- Cloud Deployment and Scalability Improvements

---

## 👨‍💻 Learning Outcomes

Through UniSkills, we gained practical experience in:

- Full Stack Web Development
- REST API Development
- Authentication & Authorization
- Database Design and Management
- Real-Time Communication
- WebRTC Integration
- Version Control using Git & GitHub
- API Testing with Postman

---

## 📌 Conclusion

UniSkills demonstrates how modern web technologies can be leveraged to build a collaborative learning platform that promotes knowledge sharing, skill development, and real-time interaction. The project combines secure authentication, efficient backend services, database management, and modern frontend development to deliver an engaging learning experience.
