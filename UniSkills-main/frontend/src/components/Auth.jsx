import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';
const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isForgotPassword) {
                const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
                alert(res.data.message || "Password reset link sent to your email!");
                setIsForgotPassword(false);
            } else if (isLogin) {
                const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
                sessionStorage.setItem('user', JSON.stringify({ 
                    id: res.data.user?.id || res.data.user_id || 1, 
                    name: res.data.user?.name || res.data.name || email.split('@')[0], 
                    initialCredits: res.data.user?.credits || res.data.credits || 100,
                    role: res.data.user?.role || 'student'
                }));
                sessionStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            } else {
                const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
                alert("Account successfully created in Database! Please log in.");
                setIsLogin(true); 
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed! Please start backend.');
        }
    };
    return (
        <div style={{ background: '#07090f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: '#9d4edd', filter: 'blur(150px)', opacity: 0.2, zIndex: 0 }}></div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '50px 40px', borderRadius: '24px', width: '400px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', zIndex: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-block', marginBottom: '15px' }}>
                        <img src="/logo.png" alt="UniSkills" style={{ height: '60px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(166, 76, 255, 0.4)' }} />
                    </div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '26px' }}>{isForgotPassword ? 'Reset Password' : isLogin ? 'Access Ecosystem' : 'Join UniSkills'}</h2>
                </div>
                {error && <div style={{ color: '#fca5a5', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isLogin && !isForgotPassword && (
                        <div>
                            <label style={{color: '#94a3b8', fontSize: '13px', marginLeft: '5px'}}>Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', marginTop: '5px', boxSizing: 'border-box' }} />
                        </div>
                    )}
                    <div>
                        <label style={{color: '#94a3b8', fontSize: '13px', marginLeft: '5px'}}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', marginTop: '5px', boxSizing: 'border-box' }} />
                    </div>
                    {!isForgotPassword && (
                        <div>
                            <label style={{color: '#94a3b8', fontSize: '13px', marginLeft: '5px'}}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', marginTop: '5px', boxSizing: 'border-box' }} />
                        </div>
                    )}
                    <button type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)' }}>
                        {isForgotPassword ? 'Send Reset Link' : isLogin ? 'Log In Securely' : 'Create Real Account'}
                    </button>
                </form>

                {isForgotPassword ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '25px', cursor: 'pointer', fontSize: '14px' }} onClick={() => { setIsForgotPassword(false); setError(''); }}>
                        Back to Login
                    </p>
                ) : (
                    <>
                        {isLogin && (
                            <p style={{ color: '#ef4444', textAlign: 'right', marginTop: '10px', marginBottom: '0', cursor: 'pointer', fontSize: '13px' }} onClick={() => { setIsForgotPassword(true); setError(''); }}>
                                Forgot Password?
                            </p>
                        )}
                        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '25px', cursor: 'pointer', fontSize: '14px' }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </p>
                    </>
                )}
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                   <p style={{ color: '#64748b', cursor: 'pointer', fontSize: '13px' }} onClick={() => navigate('/')}>← Return to Home</p>
                </div>
            </div>
        </div>
    );
};
export default Auth;
