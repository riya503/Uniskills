<div align="center">

# 🎓 UniSkills

### *The Peer-to-Peer Skill Exchange & Mentorship Platform*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

### 🌐 Live Deployment

| | Link |
|---|---|
| 🚀 **Frontend** | **[uni-skills.vercel.app](https://uni-skills.vercel.app)** |
| ⚙️ **Backend API** | **[uniskills.onrender.com](https://uniskills.onrender.com)** |

<br/>

> **UniSkills** is a full-stack web application that lets university students teach what they know and learn what they don't — powered by a real-time credit economy, live video classrooms, encrypted messaging, and an AI career mentor.


</div>

---

## ✨ What is UniSkills?

Imagine a campus where every student is both a teacher and a learner. UniSkills makes that real.

Students publish skills they can teach (e.g. *"DSA in C++"*, *"Figma UI Design"*, *"Resume Writing"*). Other students browse these skills, spend credits to request sessions, and learn directly from peers. When a session completes, credits transfer automatically — creating a self-sustaining academic economy.

---

## 🚀 Core Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | JWT-based secure login & registration with bcrypt password hashing |
| 💡 **Skill Marketplace** | Publish, browse, and request skills from any peer on the network |
| 🟡 **Credit Economy** | Internal wallet system — earn by teaching, spend by learning |
| 📡 **Real-Time Notifications** | Socket.IO powered live alerts for session requests, approvals & messages |
| 💬 **Encrypted P2P Chat** | 1-on-1 direct messaging with read receipts and unread badge counters |
| 🎥 **Live Video Classrooms** | WebRTC-based video sessions via Jitsi Meet with room-level isolation |
| 🤖 **AI Career Mentor** | Gemini-powered chatbot for resume tips, career guidance & skill advice |
| 📄 **Portfolio Upload** | Upload PDF resumes and profile photos, viewable by other users |
| 📊 **Analytics Dashboard** | Personal engagement score, session history, ledger & activity graph |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js + Express.js
- **Database:** SQLite via Sequelize ORM (auto-synced schema)
- **Auth:** JSON Web Tokens (JWT) + bcrypt
- **Real-Time:** Socket.IO (WebSocket bi-directional events)
- **File Handling:** Multer (PDF resume + profile picture uploads)
- **AI Integration:** Google Gemini API (`@google/generative-ai`)

### Frontend
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS with glassmorphism, dark mode & animations
- **Real-Time Client:** Socket.IO Client

---

## 📂 Project Structure

```
UniSkills/
├── controllers/         # Business logic (auth, skills, sessions, chat, AI)
├── models/              # Sequelize ORM models (User, Skill, Session, Message)
├── routes/              # Express route definitions
├── config/              # Database configuration
├── uploads/             # User-uploaded files (resumes, profile pics)
├── server.js            # Main server + Socket.IO initialization
├── frontend/
│   └── src/
│       ├── components/  # React components (Landing, Auth, Dashboard)
│       ├── App.jsx      # Client-side routing
│       └── index.css    # Global styling & design system
└── .env                 # Environment config (PORT, JWT_SECRET, GEMINI_API_KEY)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/karanvirsingh-1414/UniSkills.git
cd UniSkills
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root:
```env
PORT=8080
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the backend server
```bash
node server.js
```

### 5. Install & run the frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. Open the app
```
http://localhost:5173
```

> The database (`uniskills_database.sqlite`) is auto-created on first run — no setup needed.

---

## 🔌 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & receive JWT |
| GET | `/api/skills/all` | Fetch all published skills |
| POST | `/api/skills/add` | Publish a new skill |
| POST | `/api/sessions/request` | Request a mentorship session |
| POST | `/api/sessions/accept` | Accept a session (mentor) |
| POST | `/api/sessions/complete` | Complete session & transfer credits |
| GET | `/api/chat/contacts/:id` | Get all chat contacts |
| POST | `/api/chat/send` | Send a message |
| POST | `/api/ai/chat` | Chat with Gemini AI mentor |
| POST | `/api/upload/resume` | Upload PDF resume |
| POST | `/api/upload/profile-pic` | Upload profile picture |

---

## 🎯 How the Credit Economy Works

```
Student A publishes "Teaches React" → Sets price: 50 credits
Student B requests the skill → 50 credits held in escrow
Mentor accepts → Session goes Active
Live video classroom opens via Jitsi
Mentor marks session complete → 50 credits transferred to Mentor
Both users get real-time notifications via Socket.IO
```

---

## 🤖 AI Mentor

UniSkills includes a built-in AI career assistant powered by **Google Gemini**. It automatically falls back across multiple Gemini model versions for maximum availability:

```
gemini-2.5-flash → gemini-2.0-flash → gemini-1.5-flash → gemini-1.5-pro → ...
```

Ask it anything: *resume tips, interview prep, skill roadmaps, career advice.*

---

## 📸 Platform Sections

- 🏠 **Dashboard** — Engagement score, credit balance, velocity graph, ledger
- 📚 **Skills Hub** — Browse & publish skills across the network
- 👥 **Mentorship Logs** — Manage incoming requests & active sessions
- 💬 **Direct Messages** — Real-time encrypted 1-on-1 messaging
- 💳 **Wallet** — Full credit transaction history
- 🤖 **AI Mentor** — Gemini-powered career chatbot
- ⚙️ **Settings** — Profile photo, bio, CGPA, resume PDF upload

---

## 👨‍💻 Developer

**Karan Vir Singh**
[![GitHub](https://img.shields.io/badge/GitHub-karanvirsingh--1414-181717?style=flat-square&logo=github)](https://github.com/karanvirsingh-1414)

---

<div align="center">
  <sub>Built with ❤️ as a full-stack portfolio project · UniSkills © 2026</sub>
</div>
