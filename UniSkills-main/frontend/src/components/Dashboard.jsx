import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import API_BASE from '../config';
let socket;
const NotificationToast = ({ notification }) => {
  if (!notification) return null;
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, background: 'rgba(16, 185, 129, 0.9)', backdropFilter: 'blur(10px)', color: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', animation: 'fadeIn 0.3s ease', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
      🔔 {notification}
    </div>
  );
};
const UserProfileModal = ({ profile, onClose }) => {
  if (!profile) return null;
  const avatar = profile.profilePic ? (profile.profilePic.startsWith('http') ? profile.profilePic : `${API_BASE}${profile.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.id;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeIn 0.2s ease' }} onClick={onClose}>
      <div style={{ background: '#07090f', padding: '30px', borderRadius: '24px', width: '450px', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>
         <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
         <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <img src={avatar} alt="PP" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a855f7' }} />
            <div>
               <h2 style={{ margin: 0, color: 'white', fontSize: '24px' }}>{profile.name}</h2>
               <p style={{ margin: 0, color: '#f59e0b', fontWeight: 'bold', fontSize: '14px' }}>⭐ {profile.rating || '5.0'} / 5.0</p>
            </div>
         </div>
         <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', color: '#e2e8f0', fontStyle: 'italic' }}>"{profile.bio || "This user is a mystery and has no bio."}"</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '14px' }}>
                <span><b style={{ color: 'white' }}>CGPA:</b> {profile.cgpa || 'N/A'}</span>
                <span><b style={{ color: 'white' }}>Contact:</b> {profile.phone || 'Hidden'}</span>
            </div>
         </div>
         {profile.resumeUrl ? (
             <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `${API_BASE}${profile.resumeUrl}`)}`} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #a64cff, #6222b5)', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
               📄 View Portfolio / Resume PDF
             </a>
         ) : (
             <div style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>🚫 No PDF Resume Uploaded</div>
         )}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [outboundRequests, setOutboundRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [globalSkills, setGlobalSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalSkills: 0, totalSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [liveIncomingMessage, setLiveIncomingMessage] = useState(null);
  const [liveSeenNotification, setLiveSeenNotification] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const syncEcosystemData = async (userId) => {
     try {
         const res = await axios.get(`${API_BASE}/api/dashboard/me/${userId}`);
         setWalletBalance(res.data.credits);
         const allMentoring = res.data.mentoringSessions || [];
         const allLearning = res.data.learningSessions || [];
         setPendingRequests(allMentoring.filter(s => s.status === 'pending'));
         setOutboundRequests(allLearning.filter(s => s.status === 'pending'));
         setActiveSessions([
            ...allMentoring.filter(s => s.status === 'active').map(s => ({ ...s, role: 'mentor' })), 
            ...allLearning.filter(s => s.status === 'active').map(s => ({ ...s, role: 'student' }))
         ]);
         setCompletedSessions([
             ...allMentoring.filter(s => s.status === 'completed').map(s => ({ ...s, role: 'mentor' })),
             ...allLearning.filter(s => s.status === 'completed').map(s => ({ ...s, role: 'student' }))
         ]);
         const combinedHistory = [...allMentoring.filter(s => s.status === 'completed').map(s => ({ msg: `Earned 🟡 ${s.creditsTransferred} for ${s.topic}`, type: 'credit' })),
                                  ...allLearning.filter(s => s.status === 'completed').map(s => ({ msg: `Spent 🟡 ${s.creditsTransferred} for ${s.topic}`, type: 'debit' }))];
         setTransactions(combinedHistory);

         const usr = sessionStorage.getItem('user');
         if (usr) {
             const p = JSON.parse(usr);
             p.bio = res.data.bio || p.bio;
             p.cgpa = res.data.cgpa || p.cgpa;
             p.phone = res.data.phone || p.phone;
             p.profilePic = res.data.profilePic || p.profilePic;
             p.resumeUrl = res.data.resumeUrl || p.resumeUrl;
             sessionStorage.setItem('user', JSON.stringify(p));
             setCurrentUser(p);
         }
         axios.get(`${API_BASE}/api/dashboard/stats`).then(r => setStats(r.data));
         axios.get(`${API_BASE}/api/skills/all`).then(r => setGlobalSkills(r.data));
     } catch (err) { console.error("Database Sync Error:", err); }
  };
  useEffect(() => {
    socket = io(API_BASE);
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    const usr = sessionStorage.getItem('user');
    if (usr) {
      const parsedUser = JSON.parse(usr);
      setCurrentUser(parsedUser);
      setWalletBalance(parsedUser.initialCredits || 0);
      syncEcosystemData(parsedUser.id);
      if (isConnected) {
         socket.on(`notification_${parsedUser.id}`, (data) => {
            showToast(data.message);
            syncEcosystemData(parsedUser.id);
         });
         socket.on('new_skill_published', (newSkill) => {
            setGlobalSkills(prev => [newSkill, ...prev]);
            showToast(`New Skill published by ${newSkill.mentor.name}: ${newSkill.name}!`);
         });
         socket.on(`chat_${parsedUser.id}`, (newMessage) => {
            setLiveIncomingMessage(newMessage);
            showToast(`📩 Secure Text Received: from ${newMessage.sender?.name}!`);
         });
         socket.on(`chat_seen_${parsedUser.id}`, (data) => {
            setLiveSeenNotification(data.viewerId);
         });
         socket.on(`incoming_video_call_${parsedUser.id}`, (data) => {
             setIncomingCall(data);
         });
         socket.on(`video_call_accepted_${parsedUser.id}`, (data) => {
             showToast("Call Accepted by peer! Initializing Classroom...");
             setActiveVideoRoom(data.sessionId);
         });
         socket.on(`video_call_rejected_${parsedUser.id}`, () => {
             alert("The remote peer is busy and declined your video call request.");
         });
         
         return () => {
             socket.off(`notification_${parsedUser.id}`);
             socket.off('new_skill_published');
             socket.off(`chat_${parsedUser.id}`);
             socket.off(`chat_seen_${parsedUser.id}`);
             socket.off(`incoming_video_call_${parsedUser.id}`);
             socket.off(`video_call_accepted_${parsedUser.id}`);
             socket.off(`video_call_rejected_${parsedUser.id}`);
         };
      }
    } else {
      window.location.href = '/auth';
    }
  }, [isConnected]);
  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };
  if (!currentUser) return <div style={{ background: '#07090f', height:'100vh', display:'flex', justifyContent: 'center', alignItems:'center', color:'white' }}>Authenticating Securely...</div>;
  const DashboardView = () => {
    const engagementScore = (activeSessions.length * 15) + (completedSessions.length * 25) + (globalSkills.filter(s => s.mentorId === currentUser.id).length * 40);
    const activityLevel = engagementScore > 100 ? 'Platinum Tier' : engagementScore > 50 ? 'Gold Tier' : 'Novice Tier';
    return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.15))', padding: '40px', borderRadius: '24px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-30px', top: '-40px', opacity: 0.05, fontSize: '200px', userSelect: 'none' }}>📊</div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', color: 'white' }}>Command Center • {currentUser.name}</h1>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: '18px' }}>Your Personal Platform Analytics & Standing</p>
          <div style={{ display: 'inline-block', marginTop: '20px', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '30px', color: '#fde047', fontWeight: 'bold' }}>
              ⭐️ {activityLevel} (Reputation Score: {engagementScore})
          </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Ledger Balance</p>
              <h2 style={{ margin: 0, fontSize: '48px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>🟡 {walletBalance}</h2>
              <div style={{ marginTop: '25px', background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((walletBalance / 500) * 100, 100)}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', height: '100%', borderRadius: '10px', transition: '1s ease' }}></div>
              </div>
              <p style={{ margin: '10px 0 0 0', color: '#64748b', fontSize: '12px' }}>Progress Pipeline to Elite Platform Club [500 Credits]</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mentorship Dominance</p>
              <h2 style={{ margin: 0, fontSize: '48px', color: '#3b82f6' }}>{globalSkills.filter(s => s.mentorId === currentUser.id).length}</h2>
              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '13px' }}>
                   <span>Published Course Lines</span>
                   <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{completedSessions.length} Total Graduates</span>
              </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform Throughput Volume</p>
              <div style={{ display: 'flex', gap: '15px', marginTop: '18px' }}>
                  <div style={{ flexGrow: 1 }}>
                     <p style={{ margin: 0, color: '#cbd5e1', fontSize: '28px', fontWeight: 'bold' }}>{globalSkills.length}</p>
                     <p style={{ margin: 0, color: '#64748b', fontSize: '12px', marginTop: '5px' }}>Combined Ecosystem Skills</p>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ flexGrow: 1 }}>
                     <p style={{ margin: 0, color: '#cbd5e1', fontSize: '28px', fontWeight: 'bold' }}>{stats.totalSessions}</p>
                     <p style={{ margin: 0, color: '#64748b', fontSize: '12px', marginTop: '5px' }}>Global Exchange Sessions</p>
                  </div>
              </div>
          </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '30px' }}>
         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h3 style={{ margin: '0 0 25px 0', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span>Velocity Graph</span>
                 <span style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>Asset Growth Trajectory</span>
             </h3>
             <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '220px', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                {[40, 70, 45, 90, 60, 100, 85].map((h, i) => (
                    <div key={i} style={{ flexGrow: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                         <div style={{ width: '65%', height: `${h}%`, background: i === 6 ? 'linear-gradient(0deg, rgba(168, 85, 247, 0.1), #a855f7)' : 'linear-gradient(0deg, rgba(59, 130, 246, 0.1), #3b82f6)', borderRadius: '8px 8px 0 0', transition: '1s cubic-bezier(0.1, 0.8, 0.2, 1)' }}></div>
                         <div style={{ position: 'absolute', bottom: '-28px', color: '#64748b', fontSize: '11px', fontWeight: 'bold' }}>Log {i+1}</div>
                    </div>
                ))}
             </div>
         </div>
         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h3 style={{ margin: '0 0 25px 0', color: 'white' }}>Node Ledgers</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                 {transactions.length === 0 && <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>No internal ledgers recorded.</p>}
                 {transactions.map((tx, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', background: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: tx.type === 'credit' ? '#10b981' : '#ef4444' }}>
                           {tx.type === 'credit' ? '↓' : '↑'}
                        </div>
                        <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                            <p style={{ margin: 0, color: '#f8fafc', fontSize: '14px', fontWeight: 'bold' }}>{tx.type === 'credit' ? 'Incoming Transact' : 'Outgoing Debt'}</p>
                            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.msg}</p>
                        </div>
                    </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
    );
  };
  const SkillsView = () => {
    const [newSkillName, setNewSkillName] = useState("");
    const [newCreditCost, setNewCreditCost] = useState(50);
    const publishSkill = async (e) => {
      e.preventDefault();
      try {
         await axios.post(`${API_BASE}/api/skills/add`, { name: newSkillName, category: "General", credits: newCreditCost, mentorId: currentUser.id });
         setNewSkillName("");
         syncEcosystemData(currentUser.id);
         showToast("Your skill is now broadcasted globally!");
      } catch (err) { alert('Broadcast rejected by Server: ' + (err.response?.data?.error || err.message)); }
    };
    const mySkills = globalSkills.filter(s => s.mentorId === currentUser.id);
    const otherSkills = globalSkills.filter(s => s.mentorId !== currentUser.id);
    return (
      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        <div className="dashboard-header">
           <div className="header-title"><h1>Dynamic Skills Hub</h1><p>Publish your knowledge, or request from others securely.</p></div>
        </div>
        {}
        <div className="feed-panel" style={{ marginBottom: '40px', border: '1px solid rgba(59, 130, 246, 0.4)', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)' }}>
           <h3 style={{ margin: '0 0 15px 0', color: '#60a5fa' }}>Publish a New Skill To Network</h3>
           <form onSubmit={publishSkill} style={{ display: 'flex', gap: '15px' }}>
              <input type="text" placeholder="What can you teach? (e.g. Photoshop DB)" value={newSkillName} onChange={e=>setNewSkillName(e.target.value)} required style={{ flexGrow: 1, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '16px' }} />
              <input type="number" placeholder="Cost in Credits" value={newCreditCost} onChange={e=>setNewCreditCost(e.target.value)} required style={{ width: '150px', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '16px' }} />
              <button type="submit" style={{ background: '#3b82f6', color: 'white', fontWeight: 'bold', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Broadcast Live 🚀</button>
           </form>
        </div>
        <h3 style={{ margin: '0 0 20px 0', color: '#e2e8f0' }}>Learn From Others (Live Campus Feed)</h3>
        {otherSkills.length === 0 && <p style={{ color: '#94a3b8' }}>No one else has published skills yet.</p>}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {otherSkills.map(skill => {
            const avatar = skill.mentor?.profilePic ? (skill.mentor.profilePic.startsWith('http') ? skill.mentor.profilePic : `${API_BASE}${skill.mentor.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + skill.mentorId;
            return (
            <div key={skill.id} className="feed-panel" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ fontSize: '30px' }}>🌐</div>
                 <img src={avatar} alt="Mentor PP" onClick={() => setViewingProfile(skill.mentor)} style={{ width:'40px', height:'40px', borderRadius:'50%', cursor:'pointer', border:'2px solid rgba(59, 130, 246, 0.5)' }} title="Click to view full identity!" />
              </div>
              <h3 style={{ margin: 0, color: 'white' }}>{skill.name}</h3>
              <p style={{ margin: 0, color: '#4ade80', fontWeight: 'bold', fontSize: '14px' }}>Instructor: {skill.mentor?.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ color: '#fde047', fontWeight: 'bold' }}>🟡 {skill.credits}</span>
                <button style={{ background: 'linear-gradient(135deg, #a64cff, #6222b5)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                 onClick={async () => {
                   if (walletBalance < skill.credits) return alert("Not enough credits!");
                   try {
                       await axios.post(`${API_BASE}/api/sessions/request`, { topic: skill.name, mentorId: skill.mentorId, studentId: currentUser.id, offeredCredits: skill.credits });
                       syncEcosystemData(currentUser.id);
                       showToast(`Secured DB Request sent to mentor!`);
                   } catch (err) { alert(err.response?.data?.error || err.message); }
                 }}>Request
                </button>
              </div>
            </div>
          )})}
        </div>
        {mySkills.length > 0 && (
          <div style={{ marginTop: '50px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>My Published Market Skills</h3>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {mySkills.map(skill => (
                <div key={skill.id} className="feed-panel" style={{ padding: '25px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                  <h3 style={{ margin: 0, color: 'white' }}>{skill.name}</h3>
                  <p style={{ marginTop: '10px', color: '#fde047', fontWeight: 'bold', margin: '15px 0 0 0' }}>Price: 🟡 {skill.credits}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const MentorshipView = () => (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="dashboard-header"><div className="header-title"><h1>Mentorship Logs</h1><p>Accept requests securely verified by Server DB.</p></div></div>
      <div className="feed-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: 0, color: '#f59e0b' }}>⏳ Incoming Requests (For You to Teach) ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 && <p style={{ color: '#94a3b8' }}>No incoming requests.</p>}
        {pendingRequests.map(req => {
          const remoteUser = req.student;
          const avatar = remoteUser?.profilePic ? (remoteUser.profilePic.startsWith('http') ? remoteUser.profilePic : `${API_BASE}${remoteUser.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + req.studentId;
          return (
          <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <img src={avatar} alt="PP" onClick={() => setViewingProfile(remoteUser)} style={{ width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #f59e0b' }} title="View Prospect Profile" />
               <div><h4 style={{ margin: '0 0 5px 0' }}>{req.topic}</h4><p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>From: {remoteUser?.name || 'Unknown'} • Escrow: 🟡 {req.creditsTransferred}</p></div>
            </div>
            <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={async () => {
                try {
                   await axios.post(`${API_BASE}/api/sessions/accept`, { sessionId: req.id, mentorId: currentUser.id });
                   syncEcosystemData(currentUser.id);
                } catch (err) { alert(err.response?.data?.error || err.message); }
              }}>Accept Session</button>
          </div>
        )})}

        <h3 style={{ margin: '20px 0 0 0', color: '#60a5fa' }}>📤 My Sent Requests (Waiting for Mentor) ({outboundRequests.length})</h3>
        {outboundRequests.length === 0 && <p style={{ color: '#94a3b8' }}>No pending outbound requests.</p>}
        {outboundRequests.map(req => {
          const mentor = req.mentor;
          const avatar = mentor?.profilePic ? (mentor.profilePic.startsWith('http') ? mentor.profilePic : `${API_BASE}${mentor.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + req.mentorId;
          return (
          <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid #3b82f6' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
               <img src={avatar} alt="PP" onClick={() => setViewingProfile(mentor)} style={{ width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #3b82f6' }} title="View Mentor Profile" />
               <div><h4 style={{ margin: '0 0 5px 0' }}>{req.topic}</h4><p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Requested from: {mentor?.name || 'Unknown'} • Offered: 🟡 {req.creditsTransferred}</p></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>Status: Pending Approval</div>
          </div>
        )})}

        <h3 style={{ margin: '20px 0 0 0', color: '#4ade80' }}>🟢 Active Sessions ({activeSessions.length})</h3>
        {activeSessions.length === 0 && <p style={{ color: '#94a3b8' }}>No active sessions.</p>}
        {activeSessions.map(sess => {
          const remoteUser = sess.role === 'mentor' ? sess.student : sess.mentor;
          const avatar = remoteUser?.profilePic ? (remoteUser.profilePic.startsWith('http') ? remoteUser.profilePic : `${API_BASE}${remoteUser.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (sess.role === 'mentor' ? sess.studentId : sess.mentorId);
          return (
          <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img src={avatar} alt="PP" onClick={() => setViewingProfile(remoteUser)} style={{ width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', border: '2px solid #10b981' }} />
                <div><h4 style={{ margin: '0 0 5px 0' }}>{sess.topic}</h4><p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>With: {remoteUser?.name} • Value: 🟡 {sess.creditsTransferred}</p></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {sess.role === 'student' ? (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => {
                          socket.emit('initiate_video_call', { targetId: remoteUser.id, callerId: currentUser.id, callerName: currentUser.name, sessionId: sess.id, topic: sess.topic });
                          showToast(`Ringing Mentor ${remoteUser.name} securely... Waiting for them to answer.`);
                      }} style={{ background: 'linear-gradient(135deg, #a64cff, #3b82f6)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         🎥 Call Mentor Now
                      </button>
                      <span onClick={() => setActiveTooltip(activeTooltip === sess.id ? null : sess.id)} style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>i</span>
                      {activeTooltip === sess.id && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#1e293b', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '8px', padding: '12px', width: '220px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
                              <b style={{color: '#f8fafc'}}>Why do you call?</b><br/>As the student who funded this session, you hold the exclusive key to ring the video classroom precisely when you're ready to learn!
                          </div>
                      )}
                  </div>
                ) : (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '13px' }}>⏳ Waiting for Student to Call</span>
                      <span onClick={() => setActiveTooltip(activeTooltip === sess.id ? null : sess.id)} style={{ background: 'rgba(255,255,255,0.1)', color: '#94a3b8', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>i</span>
                      {activeTooltip === sess.id && (
                          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#1e293b', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', padding: '12px', width: '220px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#cbd5e1', fontSize: '12px', lineHeight: '1.5' }}>
                              <b style={{color: '#f8fafc'}}>Why wait?</b><br/>The remote student funded this timeline. You must wait for them to ring the video classroom to commence teaching when they are ready.
                          </div>
                      )}
                  </div>
                )}
                {sess.role === 'mentor' && (
                  <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={async () => {
                      try {
                          await axios.post(`${API_BASE}/api/sessions/complete`, { sessionId: sess.id });
                          syncEcosystemData(currentUser.id);
                      } catch (err) { alert(err.response?.data?.error || err.message); }
                    }}>Complete & Collect Cash!</button>
                )}
            </div>
          </div>
        )})}
        <h3 style={{ margin: '30px 0 0 0', color: '#a855f7' }}>🛑 Session History Vault ({completedSessions.length})</h3>
        {completedSessions.length === 0 && <p style={{ color: '#94a3b8' }}>No historical completed sessions recorded.</p>}
        {completedSessions.map(sess => (
          <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168, 85, 247, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#e2e8f0' }}>{sess.topic}</h4>
              <p style={{ margin: 0, color: '#a855f7', fontSize: '13px', fontWeight: 'bold' }}>{sess.role === 'mentor' ? `You Taught: ${sess.student?.name}` : `You Learned From: ${sess.mentor?.name}`}</p>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>Status: Completed ✅</span>
          </div>
        ))}
      </div>
    </div>
  );
  const WalletView = () => (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="dashboard-header"><div className="header-title"><h1>Wallet & Economy (DB Locked)</h1><p>Your Persistent SECURE UniSkills currency</p></div></div>
      <div className="stats-grid"><div className="stat-card indigo-card" style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'space-between', padding: '40px' }}>
          <div><div className="stat-label">Total Validated Ledger Balance</div><div className="stat-value" style={{ fontSize: '70px', color: '#fde047' }}>🟡 {walletBalance}</div></div>
      </div></div>
      <div className="feed-panel">
        <h3 style={{ margin: '0 0 20px 0' }}>Historical Persistent Transactions</h3>
        {transactions.length === 0 && <p style={{ color: '#94a3b8' }}>No past transactions recorded locally.</p>}
        {transactions.map((tx, idx) => (
          <p key={idx} style={{ color: tx.type === 'credit' ? '#4ade80' : '#ef4444', fontWeight: 'bold', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
             {tx.type === 'credit' ? '➕ ' : '➖ '} {tx.msg}
          </p>
        ))}
      </div>
    </div>
  );
  const ProfileView = () => {
    const [file, setFile] = useState(null);
    const [picFile, setPicFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({ bio: currentUser.bio || '', cgpa: currentUser.cgpa || '', phone: currentUser.phone || '' });
    const handleTextUpdate = async (e) => {
       e.preventDefault();
       try {
           const res = await axios.put(`${API_BASE}/api/dashboard/update-profile`, { userId: currentUser.id, ...formData });
           showToast(res.data.message);
           syncEcosystemData(currentUser.id); 
       } catch (err) { alert(err.response?.data?.error || err.message); }
    }
    const handlePdfUpload = async (e) => {
       e.preventDefault();
       if (!file) return;
       setIsUploading(true);
       const d = new FormData(); d.append('resumePdf', file); d.append('userId', currentUser.id);
       try {
           const res = await axios.post(`${API_BASE}/api/upload/resume`, d, { headers: { 'Content-Type': 'multipart/form-data' } });
           showToast(res.data.message);
           syncEcosystemData(currentUser.id);
       } catch (err) { alert(err.response?.data?.error || err.message); } finally { setIsUploading(false); setFile(null); }
    };
    const handlePicUpload = async (e) => {
       e.preventDefault();
       if (!picFile) return;
       setIsUploading(true);
       const d = new FormData(); d.append('profilePic', picFile); d.append('userId', currentUser.id);
       try {
           const res = await axios.post(`${API_BASE}/api/upload/profile-pic`, d, { headers: { 'Content-Type': 'multipart/form-data' } });
           showToast(res.data.message);
           syncEcosystemData(currentUser.id);
       } catch (err) { alert(err.response?.data?.error || err.message); } finally { setIsUploading(false); setPicFile(null); }
    };
    return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
         <div className="header-title"><h1 style={{ fontSize: '32px' }}>Professional Identity</h1><p style={{ fontSize: '16px', color: '#94a3b8' }}>Manage your ecosystem presence</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px' }}>
         <div className="feed-panel" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '35px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '12px', fontSize: '20px' }}>📖</div>
                  <h3 style={{ margin: 0, color: 'white', fontSize: '22px' }}>Textual Bio & Portfolio</h3>
              </div>
              <form onSubmit={handleTextUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                     <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>A Short Bio about what you teach / learn</label>
                     <textarea value={formData.bio} onChange={e=>setFormData({...formData, bio: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: 'white', borderRadius: '12px', minHeight: '100px', fontSize: '15px', boxSizing: 'border-box' }} />
                 </div>
                 <div style={{ display: 'flex', gap: '25px' }}>
                    <div style={{ flexGrow: 1 }}>
                       <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Current CGPA</label>
                       <input type="text" value={formData.cgpa} onChange={e=>setFormData({...formData, cgpa: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: 'white', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                       <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Public Contact #</label>
                       <input type="text" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: 'white', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box' }} />
                    </div>
                 </div>
                 <button type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', fontWeight: 'bold', border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)', marginTop: '10px' }}>Sync Core Details</button>
              </form>
         </div>
         <div className="feed-panel" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '35px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'rgba(253, 224, 71, 0.2)', padding: '12px', borderRadius: '12px', fontSize: '20px' }}>⭐️</div>
                  <h3 style={{ margin: 0, color: '#fde047', fontSize: '22px' }}>Media Modules</h3>
              </div>
              {}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ margin: '0 0 15px 0', color: '#e2e8f0', fontWeight: 'bold', fontSize: '15px' }}>Visual Profile Photo</p>
                 <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={currentUser.profilePic ? (currentUser.profilePic.startsWith('http') ? currentUser.profilePic : `${API_BASE}${currentUser.profilePic}`) : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + currentUser.id} alt="PP" style={{ width: '80px', height: '80px', borderRadius: '16px', border: '2px solid #3b82f6', objectFit: 'cover' }} />
                    <form onSubmit={handlePicUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                        <input id="picFileUploader" type="file" accept="image/*" onChange={e => setPicFile(e.target.files[0])} style={{ display: 'none' }} />
                        <label htmlFor="picFileUploader" style={{ display: 'inline-block', background: picFile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)', border: picFile ? '1px solid #10b981' : '1px dashed rgba(255,255,255,0.2)', color: picFile ? '#10b981' : '#94a3b8', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '14px', transition: '0.2s' }}>
                            {picFile ? `📁 ${picFile.name.substring(0, 20)}...` : `+ Browse Picture`}
                        </label>
                        <button type="submit" disabled={!picFile || isUploading} style={{ background: picFile ? '#10b981' : 'rgba(255,255,255,0.05)', color: picFile ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', padding: '12px', borderRadius: '8px', cursor: picFile ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>Apply Photo</button>
                    </form>
                 </div>
              </div>
              {}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                     <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 'bold', fontSize: '15px' }}>Resumé & Portfolio (PDF)</p>
                     {currentUser.resumeUrl && <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(currentUser.resumeUrl.startsWith('http') ? currentUser.resumeUrl : `${API_BASE}${currentUser.resumeUrl}`)}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Open Document</a>}
                 </div>
                 <form onSubmit={handlePdfUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input id="pdfUploader" type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
                    <label htmlFor="pdfUploader" style={{ display: 'inline-block', background: file ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.03)', border: file ? '1px solid #a855f7' : '1px dashed rgba(255,255,255,0.2)', color: file ? '#d8b4fe' : '#94a3b8', padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '14px', transition: '0.2s' }}>
                        {file ? `📄 ${file.name.substring(0, 25)}...` : `+ Browse Document (.pdf)`}
                    </label>
                    <button type="submit" disabled={!file || isUploading} style={{ background: file ? '#a855f7' : 'rgba(255,255,255,0.05)', color: file ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', padding: '12px', borderRadius: '8px', cursor: file ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>Commit PDF</button>
                 </form>
              </div>
              <button onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: 'auto', transition: '0.2s' }}>Sign Out Sequence</button>
         </div>
      </div>
    </div>
    );
  };
  const AIAssistantView = () => {
      const [messages, setMessages] = useState([{ sender: 'bot', text: "Hello! I am your UniSkills AI Ecosystem Assistant. Whether you need exact guidance on crafting your Developer Resume, or tips on cracking technical interviews within the UniSkills domain, ask me anything!" }]);
      const [input, setInput] = useState("");
      const [isTyping, setIsTyping] = useState(false);
      const handleRequest = async (e) => {
          e.preventDefault();
          if (!input.trim()) return;
          const userMsg = input;
          setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
          setInput("");
          setIsTyping(true);
          try {
              const res = await axios.post(`${API_BASE}/api/ai/chat`, { prompt: userMsg });
              setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
          } catch (err) {
              setMessages(prev => [...prev, { sender: 'bot', text: `⚠️ System Error: ${err.response?.data?.error || err.message}` }]);
          } finally {
              setIsTyping(false);
          }
      };
      return (
      <div style={{ animation: 'fadeIn 0.4s ease', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="dashboard-header"><div className="header-title"><h1>🤖 UniSkills Generative AI</h1><p>Your 24/7 personal career and learning architect powered by Gemini</p></div></div>
          <div className="feed-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '12px' }}>
              {messages.map((msg, idx) => (
                  <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', background: msg.sender === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '12px', maxWidth: '75%', lineHeight: '1.6', color: 'white' }}>
                      {msg.sender === 'bot' && <b style={{ display: 'block', marginBottom: '8px', color: '#a855f7' }}>AI Mentor</b>}
                      {msg.text}
                  </div>
              ))}
              {isTyping && <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '15px 25px', borderRadius: '12px', color: '#94a3b8', fontStyle: 'italic' }}>AI is thinking about your career path...</div>}
          </div>
          <form onSubmit={handleRequest} style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <input type="text" value={input} onChange={e=>setInput(e.target.value)} placeholder="E.g. What are the top 3 soft skills needed for a remote tech job?" required style={{ flexGrow: 1, background: 'rgba(0,0,0,0.4)', border: '1px border rgba(255,255,255,0.1)', padding: '18px', color: 'white', borderRadius: '12px', fontSize: '16px' }} />
              <button type="submit" disabled={isTyping} style={{ background: 'linear-gradient(135deg, #a64cff, #3b82f6)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '12px', cursor: isTyping ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>Send Intelligence</button>
          </form>
      </div>
      );
  };
  const MessagesView = () => {
      const [contacts, setContacts] = useState([]);
      const [activeChat, setActiveChat] = useState(null); 
      const [chatHistory, setChatHistory] = useState([]);
      const [msgInput, setMsgInput] = useState("");
      const fetchContactsGlobally = () => {
          axios.get(`${API_BASE}/api/chat/contacts/${currentUser.id}`)
               .then(res => setContacts(res.data))
               .catch(console.error);
      };
      useEffect(() => { fetchContactsGlobally(); }, []);
      const markAsSeenOnServer = async (partnerId) => {
          try { 
             await axios.put(`${API_BASE}/api/chat/mark-seen`, { myUserId: currentUser.id, chatPartnerId: partnerId }); 
             fetchContactsGlobally();
          } catch(e) { console.error(e); }
      }
      useEffect(() => {
          if (activeChat) {
             axios.get(`${API_BASE}/api/chat/history/${currentUser.id}/${activeChat.id}`).then(res => {
                 setChatHistory(res.data);
                 markAsSeenOnServer(activeChat.id);
             }).catch(console.error);
          }
      }, [activeChat]);
      useEffect(() => {
          if (liveIncomingMessage) {
              fetchContactsGlobally();
              if (activeChat && liveIncomingMessage.senderId === activeChat.id) {
                  setChatHistory(prev => [...prev, liveIncomingMessage]);
                  markAsSeenOnServer(activeChat.id);
              }
          }
      }, [liveIncomingMessage]);
      useEffect(() => {
          if (liveSeenNotification && activeChat && liveSeenNotification === activeChat.id) {
              setChatHistory(prev => prev.map(msg => msg.senderId === currentUser.id ? { ...msg, read: true } : msg));
          }
      }, [liveSeenNotification, activeChat]);
      const handleSend = async (e) => {
          e.preventDefault();
          if (!msgInput.trim() || !activeChat) return;
          try {
              const res = await axios.post(`${API_BASE}/api/chat/send`, { senderId: currentUser.id, receiverId: activeChat.id, content: msgInput });
              setChatHistory(prev => [...prev, res.data]);
              setMsgInput("");
              fetchContactsGlobally();
          } catch(err) { alert(err.message); }
      };
      return (
      <div style={{ display: 'flex', height: '100%', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ width: '320px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.4)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><h3 style={{ margin: 0, color: 'white' }}>💬 Network Contacts</h3></div>
              <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                  {contacts.length === 0 && <p style={{ padding: '20px', color: '#94a3b8' }}>No one else on campus yet.</p>}
                  {contacts.map(c => {
                      const avatar = c.profilePic ? (c.profilePic.startsWith('http') ? c.profilePic : `${API_BASE}${c.profilePic}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`;
                      const isActive = activeChat?.id === c.id;
                      return (
                      <div key={c.id} onClick={() => setActiveChat(c)} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', cursor: 'pointer', background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' }}>
                          <img src={avatar} alt="PP" style={{ width: '45px', height: '45px', borderRadius: '50%', border: isActive ? '2px solid #a855f7' : '2px solid transparent' }} />
                          <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <p style={{ margin: 0, color: 'white', fontWeight: 'bold' }}>{c.name}</p>
                                 {c.unreadCount > 0 && <span style={{ background: '#10b981', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>{c.unreadCount}</span>}
                              </div>
                              <p style={{ margin: '3px 0 0 0', color: c.unreadCount > 0 ? '#10b981' : '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                 {c.lastMessage ? c.lastMessage : 'Tap to start secure chat'}
                              </p>
                          </div>
                      </div>
                  )})}
              </div>
          </div>
          {}
          {activeChat ? (
          <div style={{ flexGrow: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent)' }}>
                  <img src={activeChat.profilePic ? (activeChat.profilePic.startsWith('http') ? activeChat.profilePic : `${API_BASE}${activeChat.profilePic}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.id}`} style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #3b82f6', cursor: 'pointer' }} onClick={() => setViewingProfile(activeChat)} />
                  <div><h3 style={{ margin: 0, color: 'white' }}>{activeChat.name}</h3><span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>● Secure P2P WebSocket Connected</span></div>
              </div>
              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {chatHistory.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>No prior messages. Start the interaction securely.</div>}
                  {chatHistory.map((msg, i) => {
                      const isMe = msg.senderId === currentUser.id;
                      const dynamicGradient = msg.read ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)';
                      const bgStyle = isMe ? dynamicGradient : 'rgba(255,255,255,0.05)';
                      return (
                      <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', background: bgStyle, padding: '14px 20px', borderRadius: '15px', color: 'white', maxWidth: '75%', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                          <p style={{ margin: 0, lineHeight: '1.5' }}>{msg.content}</p>
                          <small style={{ display: 'block', textAlign: 'right', opacity: 0.6, fontSize: '11px', marginTop: '8px' }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              {isMe && <span style={{ marginLeft: '6px', fontWeight: 'bold', fontSize: '13px' }}>{msg.read ? '✓✓' : '✓'}</span>}
                          </small>
                      </div>
                  )})}
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.3)' }}>
                  <input type="text" value={msgInput} onChange={e=>setMsgInput(e.target.value)} placeholder="Type a secure WebSockets encrypted message..." style={{ flexGrow: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '18px', borderRadius: '12px 0 0 12px', fontSize: '15px' }} />
                  <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 35px', fontWeight: 'bold', fontSize: '15px', borderRadius: '0 12px 12px 0', cursor: 'pointer' }}>Send Frame ➤</button>
              </form>
          </div>
          ) : (
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: '#64748b' }}>
               <div style={{ fontSize: '80px', opacity: 0.3, marginBottom: '20px' }}>💬</div>
               <h2>1-on-1 Encrypted Messaging Hub</h2>
               <p>Select a verified contact from the left network cluster to launch secure sockets.</p>
          </div>
          )}
      </div>
      );
  };
  const renderContent = () => {
    if (activeVideoRoom) {
        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', background: '#07090f', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '15px 25px', background: 'rgba(0,0,0,0.8)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                       <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                       <h3 style={{ margin: 0, color: 'white' }}>Live P2P Subsystem Encryption [Room ID: {activeVideoRoom}]</h3>
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                       <a href={`https://meet.systemli.org/UniSkills_Classroom_${activeVideoRoom}`} target="_blank" rel="noreferrer" style={{ background: '#3b82f6', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>Open in New Tab ↗️</a>
                       <button onClick={() => setActiveVideoRoom(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(239, 68, 68, 0.4)' }}>Leave Classroom</button>
                   </div>
                </div>
                {}
                <iframe 
                    allow="camera; microphone; fullscreen; display-capture; autoplay" 
                    src={`https://meet.systemli.org/UniSkills_Classroom_${activeVideoRoom}`} 
                    style={{ height: 'calc(100% - 60px)', width: '100%', border: 'none', marginTop: '60px' }}
                ></iframe>
            </div>
        );
    }
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'skills': return <SkillsView />;
      case 'mentorship': return <MentorshipView />;
      case 'messages': return <MessagesView />;
      case 'wallet': return <WalletView />;
      case 'profile': return <ProfileView />;
      case 'assistant': return <AIAssistantView />;
      default: return <DashboardView />;
    }
  };
  return (
    <>
      <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bouncePulse { 0% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); } 100% { transform: scale(1.03); box-shadow: 0 0 40px rgba(59, 130, 246, 0.9); border-color: #60a5fa; } }
          @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
      <NotificationToast notification={notification} />
      <UserProfileModal profile={viewingProfile} onClose={() => setViewingProfile(null)} />
      {}
      {incomingCall && !activeVideoRoom && (
          <div style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'rgba(7, 9, 15, 0.95)', backdropFilter: 'blur(20px)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '30px', zIndex: 99999, animation: 'bouncePulse 1s infinite alternate', width: '350px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'white', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>📞 Incoming Classroom Call</h3>
              <p style={{ color: '#94a3b8', margin: '0 0 25px 0', lineHeight: '1.5' }}><b style={{color:'#fde047'}}>{incomingCall.callerName}</b> is ringing you for a Live Video Mentorship over: <br/><b>"{incomingCall.topic}"</b>.</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                   <button onClick={() => {
                       socket.emit('accept_video_call', { callerId: incomingCall.callerId, sessionId: incomingCall.sessionId });
                       setIncomingCall(null);
                       setActiveVideoRoom(incomingCall.sessionId);
                   }} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', flexGrow: 1, padding: '14px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.4)' }}>Answer Class</button>
                   <button onClick={() => {
                       socket.emit('reject_video_call', { callerId: incomingCall.callerId });
                       setIncomingCall(null);
                   }} style={{ background: '#ef4444', color: 'white', padding: '14px 20px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '15px' }}>Decline</button>
              </div>
          </div>
      )}
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><img src="/logo.png" alt="Logo" style={{ height: '35px', borderRadius: '8px' }} /><div>UniSkills</div></div>
          <div className="nav-menu">
            <div className={`nav-item ${activeTab==='dashboard'?'active':''}`} onClick={()=>setActiveTab('dashboard')}><span className="nav-icon">🏠</span> Dashboard</div>
            <div className={`nav-item ${activeTab==='skills'?'active':''}`} onClick={()=>setActiveTab('skills')}><span className="nav-icon">📚</span> Global Skills</div>
            <div className={`nav-item ${activeTab==='mentorship'?'active':''}`} onClick={()=>setActiveTab('mentorship')}><span className="nav-icon">👥</span> Mentorship Live</div>
            <div className={`nav-item ${activeTab==='messages'?'active':''}`} onClick={()=>setActiveTab('messages')}><span className="nav-icon">💬</span> Direct Messages</div>
            <div className={`nav-item ${activeTab==='wallet'?'active':''}`} onClick={()=>setActiveTab('wallet')}><span className="nav-icon">💳</span> Internal Wallet</div>
            <div className={`nav-item ${activeTab==='assistant'?'active':''}`} onClick={()=>setActiveTab('assistant')}><span className="nav-icon">🤖</span> AI Chat Mentor</div>
            <div className={`nav-item ${activeTab==='profile'?'active':''}`} onClick={()=>setActiveTab('profile')}><span className="nav-icon">⚙️</span> Settings</div>
          </div>
          <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8' }}>Logged in as</p>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img src={currentUser.profilePic ? (currentUser.profilePic.startsWith('http') ? currentUser.profilePic : `${API_BASE}${currentUser.profilePic}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} alt="Me" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                <p style={{ margin: 0, fontWeight: 'bold', color: '#4ade80' }}>{currentUser.name}</p>
            </div>
          </div>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </>
  );
};
export default Dashboard;
