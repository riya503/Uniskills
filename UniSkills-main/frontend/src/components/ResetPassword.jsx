import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE from '../config';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE}/api/auth/reset-password`, { 
                token, 
                newPassword: password 
            });
            setMessage(res.data.message || "Password reset successful!");
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reset password.');
        }
    };

    return (
        <div style={{ background: '#07090f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: '#ef4444', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '50px 40px', borderRadius: '24px', width: '400px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)', zIndex: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-block', marginBottom: '15px' }}>
                        <img src="/logo.png" alt="UniSkills" style={{ height: '60px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.4)' }} />
                    </div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '26px' }}>Set New Password</h2>
                </div>
                
                {error && <div style={{ color: '#fca5a5', marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
                {message && <div style={{ color: '#86efac', marginBottom: '20px', textAlign: 'center', background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(34,197,94,0.2)' }}>{message} <br/> Redirecting to Login...</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{color: '#94a3b8', fontSize: '13px', marginLeft: '5px'}}>New Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', marginTop: '5px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{color: '#94a3b8', fontSize: '13px', marginLeft: '5px'}}>Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white', marginTop: '5px', boxSizing: 'border-box' }} />
                    </div>
                    
                    <button type="submit" disabled={message !== ''} style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: message ? 'not-allowed' : 'pointer', marginTop: '15px', boxShadow: '0 5px 15px rgba(239, 68, 68, 0.3)' }}>
                        Save Password
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                   <p style={{ color: '#64748b', cursor: 'pointer', fontSize: '13px' }} onClick={() => navigate('/auth')}>← Return to Login</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
