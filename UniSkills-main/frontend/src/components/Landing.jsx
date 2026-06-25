import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Active Exchange Sessions", value: "1,200+" },
        { label: "Skills Registered", value: "85+" },
        { label: "Credits Exchanged", value: "15k+" }
    ];

    const coreCards = [
        {
            icon: "📚",
            badge: "LEARN & TEACH",
            title: "P2P Skill Exchange",
            desc: "List the skills you excel at and those you want to learn. Our ecosystem matches you with peers for interactive, direct knowledge exchange sessions.",
            color: "#a855f7"
        },
        {
            icon: "🪙",
            badge: "SECURE ECONOMY",
            title: "Virtual Credit Wallet",
            desc: "Keep learning free and fair. Earn credits by teaching your peers and spend them when you need to learn from others. No real money required.",
            color: "#3b82f6"
        },
        {
            icon: "📈",
            badge: "CAMPUS HUB",
            title: "Live Dashboard",
            desc: "Track campus trends, monitor available mentors, view top requested skills, and join open exchange lobbies in real-time.",
            color: "#10b981"
        }
    ];

    const steps = [
        { num: "01", title: "Create Profile", text: "Sign up and list the skills you excel at and what you want to learn." },
        { num: "02", title: "Request & Match", text: "Browse matching peers or post a dynamic session request on the dashboard." },
        { num: "03", title: "Trade Credits", text: "Exchange credits securely when hosting or booking a peer mentoring session." }
    ];

    return (
        <div style={{ background: '#07090f', minHeight: '100vh', color: 'white', overflowX: 'hidden', position: 'relative', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .glow-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 35px 25px;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    text-align: left;
                    position: relative;
                    overflow: hidden;
                }
                .glow-card:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.12);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                }
                .glow-card:hover .icon-box {
                    transform: scale(1.1) rotate(2deg);
                }
                .nav-link {
                    cursor: pointer;
                    transition: color 0.2s, transform 0.2s;
                }
                .nav-link:hover {
                    color: white !important;
                    transform: translateY(-1px);
                }
                .btn-glow {
                    transition: all 0.3s ease;
                }
                .btn-glow:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
                }
                .btn-secondary {
                    transition: all 0.3s ease;
                }
                .btn-secondary:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: rgba(255, 255, 255, 0.4) !important;
                }
                .step-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.02));
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    border-radius: 16px;
                    padding: 30px 20px;
                    transition: all 0.3s ease;
                }
                .step-card:hover {
                    border-color: rgba(168, 85, 247, 0.2);
                    background: rgba(255, 255, 255, 0.03);
                }
                .feature-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 60px;
                    margin: 100px 0;
                    width: 100%;
                    max-width: 1100px;
                    text-align: left;
                }
                @media (max-width: 768px) {
                    .feature-row {
                        flex-direction: column !important;
                        text-align: center;
                        gap: 30px;
                        margin: 60px 0;
                    }
                    .feature-image {
                        max-width: 100% !important;
                    }
                }
            `}</style>

            {/* Glowing background blurs */}
            <div style={{ position: 'absolute', top: '5%', left: '-10%', width: '600px', height: '600px', background: '#7c3aed', filter: 'blur(220px)', opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '600px', height: '600px', background: '#2563eb', filter: 'blur(220px)', opacity: 0.12, zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10%', left: '20%', width: '500px', height: '500px', background: '#db2777', filter: 'blur(200px)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }}></div>

            {/* Navigation */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 8%', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(7, 9, 15, 0.7)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', letterSpacing: '-0.5px' }} onClick={() => window.scrollTo(0,0)}>
                    <img src="/logo.png" alt="UniSkills Logo" style={{ height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <span>UniSkills</span>
                </div>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', color: '#94a3b8', fontWeight: '500', fontSize: '14px' }}>
                    <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-link">Home</span>
                    <span onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="nav-link">Features</span>
                    <span onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="nav-link">How it Works</span>
                    <span onClick={() => document.getElementById('stats').scrollIntoView({ behavior: 'smooth' })} className="nav-link">Stats</span>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate('/auth')} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }} className="btn-secondary">Log In</button>
                    <button onClick={() => navigate('/auth')} style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', padding: '8px 22px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }} className="btn-glow">Get Started</button>
                </div>
            </nav>

            {/* Hero & Showcase Main Block */}
            <main style={{ position: 'relative', zIndex: 1, padding: '70px 8% 50px 8%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                
                {/* Badge */}
                <div style={{ border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.08)', padding: '6px 16px', borderRadius: '30px', color: '#c084fc', fontWeight: '700', fontSize: '12px', marginBottom: '25px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    🚀 REVOLUTIONIZING CAMPUS LEARNING
                </div>
                
                {/* Main Heading */}
                <h1 style={{ fontSize: '64px', margin: '0 0 20px 0', background: 'linear-gradient(to right, #ffffff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800', letterSpacing: '-1.5px', maxWidth: '850px', lineHeight: '1.1' }}>
                    The Universal Skill Exchange Ecosystem
                </h1>
                
                {/* Description */}
                <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '650px', lineHeight: '1.6', marginBottom: '40px' }}>
                    Connect with peers, master new skills, and earn virtual learning credits. UniSkills transforms campus networking into a dynamic, decentralized knowledge marketplace.
                </p>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '60px' }}>
                    <button onClick={() => navigate('/auth')} style={{ background: '#f8fafc', color: '#07090f', border: 'none', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(255, 255, 255, 0.05)', transition: 'transform 0.2s' }} onMouseOver={(e)=>e.target.style.transform='scale(1.02)'} onMouseOut={(e)=>e.target.style.transform='scale(1)'}>
                        Enter the Platform
                    </button>
                    <button onClick={() => document.getElementById('about').scrollIntoView({behavior: 'smooth'})} style={{ background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 36px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }} className="btn-secondary">
                        How it Works ↓
                    </button>
                </div>

                {/* Core Showcase Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', maxWidth: '1100px', marginTop: '20px' }}>
                    {coreCards.map((card, i) => (
                        <div key={i} className="glow-card" style={{ cursor: 'default' }}>
                            <div className="icon-box" style={{ 
                                fontSize: '32px', 
                                marginBottom: '20px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: '60px', 
                                height: '60px', 
                                background: `rgba(255,255,255,0.02)`, 
                                border: `1px solid rgba(255, 255, 255, 0.05)`, 
                                borderRadius: '14px',
                                boxShadow: `inset 0 0 12px rgba(255,255,255,0.02)`,
                                transition: 'all 0.4s ease'
                            }}>{card.icon}</div>
                            
                            <div style={{ 
                                display: 'inline-block', 
                                fontSize: '10px', 
                                fontWeight: '850', 
                                color: card.color, 
                                background: `${card.color}15`, 
                                padding: '4px 10px', 
                                borderRadius: '6px', 
                                letterSpacing: '1px',
                                marginBottom: '12px'
                            }}>
                                {card.badge}
                            </div>
                            
                            <h3 style={{ fontSize: '20px', margin: '0 0 12px 0', fontWeight: '700', color: '#f8fafc' }}>
                                {card.title}
                            </h3>
                            
                            <p style={{ color: '#94a3b8', lineHeight: '1.6', margin: 0, fontSize: '14.5px' }}>
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Unique Showcase Rows with generated illustrations */}
                <section id="features" style={{ width: '100%', maxWidth: '1100px', marginTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* Feature 1: Peer-to-Peer Interactive Learning */}
                    <div className="feature-row">
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.08)', padding: '5px 12px', borderRadius: '30px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Interactive Education
                            </span>
                            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '15px 0', color: '#f8fafc', lineHeight: '1.2' }}>
                                Collab-focused Peer Study Rooms
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
                                Find other students on campus who possess the exact technical expertise you want to acquire. Connect instantly via secure chat rooms powered by Firebase and schedule direct WebRTC video meetings through Jitsi integration. Expand your coding knowledge, project capabilities, and portfolio collaboratively.
                            </p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                position: 'relative',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                overflow: 'hidden',
                                padding: '8px',
                                background: 'rgba(255,255,255,0.01)',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                maxWidth: '450px'
                            }} className="feature-image">
                                <img src="/peer_learning.png" alt="Peer Learning Illustration" style={{ width: '100%', borderRadius: '18px', display: 'block' }} />
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Decentralized Credit Economy */}
                    <div className="feature-row" style={{ flexDirection: 'row-reverse' }}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#a855f7', background: 'rgba(168, 85, 247, 0.08)', padding: '5px 12px', borderRadius: '30px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Campus Credit Ledger
                            </span>
                            <h2 style={{ fontSize: '36px', fontWeight: '800', margin: '15px 0', color: '#f8fafc', lineHeight: '1.2' }}>
                                Earn Credits by Sharing Your Knowledge
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.7', margin: 0 }}>
                                Keep education democratic. Teaching others awards you learning credits inside your virtual wallet. Use these credits to request mentoring sessions in advanced fields, review code repositories with top-tier peers, or get structured roadmap feedback. A completely cashless peer-to-peer knowledge network.
                            </p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <div style={{
                                position: 'relative',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                overflow: 'hidden',
                                padding: '8px',
                                background: 'rgba(255,255,255,0.01)',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                                maxWidth: '450px'
                            }} className="feature-image">
                                <img src="/credit_wallet.png" alt="Credit Wallet Illustration" style={{ width: '100%', borderRadius: '18px', display: 'block' }} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* How It Works Section */}
            <section id="about" style={{ padding: '80px 8%', borderTop: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.005)' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '36px', margin: '0 0 15px 0', fontWeight: '800', letterSpacing: '-0.5px' }}>How it Works</h2>
                    <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
                        Start learning from peer mentors and share your own skills in 3 simple steps.
                    </p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                    {steps.map((step, i) => (
                        <div key={i} className="step-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#a855f7', background: 'rgba(168, 85, 247, 0.08)', padding: '4px 10px', borderRadius: '6px' }}>STEP {step.num}</span>
                                <span style={{ fontSize: '30px', fontWeight: '900', color: 'rgba(255,255,255,0.03)', lineHeight: 1 }}>{step.num}</span>
                            </div>
                            <h3 style={{ fontSize: '18px', margin: 0, fontWeight: '700', color: '#f8fafc' }}>{step.title}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats section */}
            <section id="stats" style={{ padding: '80px 8%', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
                    {stats.map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', fontWeight: '800', background: 'linear-gradient(135deg, #ffffff, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                                {stat.value}
                            </div>
                            <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', letterSpacing: '0.5px' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '40px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#040508' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: '900', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                        <img src="/logo.png" alt="UniSkills logo" style={{ height: '30px', borderRadius: '6px' }} />
                        <span>UniSkills</span>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>© 2026 UniSkills Platform. Built by students, for students.</div>
                </div>
                <div style={{ display: 'flex', gap: '25px', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
                    <span style={{ cursor: 'pointer' }} className="nav-link">Privacy</span>
                    <span style={{ cursor: 'pointer' }} className="nav-link">Terms</span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
