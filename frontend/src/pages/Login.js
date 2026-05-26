import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [showForgot, setShowForgot] = useState(false);

    // --- KEEP YOUR ORIGINAL STATES EXACTLY AS THEY WERE ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPassword2, setRegPassword2] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [regMessage, setRegMessage] = useState('');
    const [regError, setRegError] = useState('');
    const [googleError, setGoogleError] = useState('');
    const [loginError, setLoginError] = useState('');
    const { login, loading, error, forgotPassword } = useAuth();

    // --- KEEP YOUR ORIGINAL HANDLERS EXACTLY AS THEY WERE ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        
        if (!username || !password) {
            setLoginError('Username and password are required!');
            return;
        }
        
        const success = await login(username, password);
        if (success) {
            window.location.href = '/';
        } else {
            setLoginError('Invalid username or password!');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegMessage('');
        if (regPassword !== regPassword2) {
            setRegError('Passwords do not match!');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                username: regUsername,
                email: regEmail,
                password: regPassword,
            });
            setRegMessage('Account created! You can now login.');
            setTimeout(() => setIsLogin(true), 2000);
        } catch (err) {
            setRegError(err.response?.data?.username?.[0] || 'Registration failed!');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleError('');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const token = await user.getIdToken();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ username: user.email }));
            window.location.href = '/';
        } catch (err) {
            setGoogleError('Google login failed!');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const result = await forgotPassword(forgotEmail);
        setForgotMessage(result.message);
    };

    // --- NEW FIXED & ANIMATED DESIGN STRUCTURE ---
    return (
        <div className="auth-page-wrapper">
            <Link to="/landing" style={{ position: 'absolute', top: '20px', left: '20px', color: '#00d2ff', textDecoration: 'none', zIndex: 1001, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                ← Back to Home
            </Link>
            <style>{`
                /* General Page Setup */
                .auth-page-wrapper {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #0c111a; /* Dark background from screenshot */
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow: hidden;
                }

                /* Main Container */
                .auth-container {
                    position: relative;
                    width: 1000px;
                    height: 600px;
                    background-color: #161d29; /* Slightly lighter dark for the card */
                    border-radius: 30px;
                    box-shadow: 0 15px 50px rgba(0, 210, 255, 0.2); /* Neon cyan glow */
                    border: 1px solid rgba(0, 210, 255, 0.1);
                    overflow: hidden;
                    display: flex;
                }

                /* Animated Sliding Overlay Panel */
                .overlay-container {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    transition: transform 0.6s ease-in-out;
                    z-index: 100;
                    /* Diagonal cut-out like screenshot */
                    clip-path: ${isLogin ? 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' : 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'};
                    transform: ${isLogin ? 'translateX(0)' : 'translateX(-100%)'};
                }

                .overlay {
                    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
                    color: #ffffff;
                    position: relative;
                    left: -100%;
                    height: 100%;
                    width: 200%;
                    transform: ${isLogin ? 'translateX(0)' : 'translateX(50%)'};
                    transition: transform 0.6s ease-in-out;
                    display: flex;
                    align-items: center;
                }

                .overlay-panel {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 0 60px;
                    text-align: center;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    transition: transform 0.6s ease-in-out;
                }

                .overlay-left {
                    transform: ${isLogin ? 'translateX(-20%)' : 'translateX(0)'};
                }

                .overlay-right {
                    right: 0;
                    transform: ${isLogin ? 'translateX(0)' : 'translateX(20%)'};
                }

                .overlay h1 {
                    font-size: 3.5rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                    letter-spacing: -2px;
                }

                .overlay p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin-bottom: 30px;
                }

                /* Ghost Button for Overlay */
                .ghost-button {
                    background-color: transparent;
                    border: 2px solid #ffffff;
                    color: #ffffff;
                    padding: 12px 35px;
                    border-radius: 50px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .ghost-button:hover {
                    background-color: #ffffff;
                    color: #3a7bd5;
                }

                /* Form Areas */
                .form-container {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px;
                    transition: all 0.6s ease-in-out;
                    z-index: 1;
                }

                .login-form-container {
                    left: 0;
                    opacity: ${isLogin ? '1' : '0'};
                    z-index: ${isLogin ? '5' : '1'};
                }

                .register-form-container {
                    left: 0;
                    opacity: ${!isLogin ? '1' : '0'};
                    z-index: ${!isLogin ? '5' : '1'};
                    transform: ${isLogin ? 'translateX(0)' : 'translateX(100%)'};
                }

                .form-box {
                    width: 100%;
                    max-width: 350px;
                    text-align: center;
                }

                .form-box h2 {
                    color: #ffffff;
                    font-size: 2.2rem;
                    font-weight: 700;
                    margin-bottom: 35px;
                }

                /* Input Styling like Screenshot */
                .input-group {
                    margin-bottom: 20px;
                    text-align: left;
                }

                .input-group label {
                    color: #00d2ff;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 7px;
                    display: block;
                    letter-spacing: 1px;
                }

                .input-group input {
                    width: 100%;
                    background-color: transparent;
                    border: none;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 12px 0;
                    color: #ffffff;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.3s;
                }

                .input-group input:focus {
                    border-bottom-color: #00d2ff;
                }

                /* Main Action Button */
                .main-button {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(to right, #00d2ff, #3a7bd5);
                    border: none;
                    border-radius: 50px;
                    color: #ffffff;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-top: 25px;
                    box-shadow: 0 8px 20px rgba(0, 210, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .main-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 25px rgba(0, 210, 255, 0.4);
                }

                .main-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Status Messages */
                .status-message {
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                }

                .error {
                    color: #ff5252;
                    background-color: rgba(255, 82, 82, 0.1);
                    border: 1px solid #ff5252;
                }

                .success {
                    color: #00e676;
                    background-color: rgba(0, 230, 118, 0.1);
                    border: 1px solid #00e676;
                }

            `}</style>

            <div className="auth-container">
                {/* 1. REGISTRATION FORM (Hidden by default) */}
                <div className="form-container register-form-container">
                    <div className="form-box">
                        <h2>Create Account</h2>

                        {/* KEEP YOUR MESSAGES EXACTLY */}
                        {regError && <div className="status-message error"> {regError}</div>}
                        {regMessage && <div className="status-message success"> {regMessage}</div>}

                        {/* KEEP YOUR HANDLER */}
                        <form onSubmit={handleRegister}>
                            <div className="input-group">
                                <label>Username</label>
                                {/* KEEP YOUR PROPS */}
                                <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Type Your Password</label>
                                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Confirm Your Password</label>
                                <input type="password" value={regPassword2} onChange={e => setRegPassword2(e.target.value)} required />
                            </div>
                            <button className="main-button" type="submit">SIGN UP</button>
                        </form>
                    </div>
                </div>

                {/* 2. LOGIN & FORGOT FORM (Visible by default) */}
                <div className="form-container login-form-container">
                    <div className="form-box">
                        <h2>{showForgot ? 'Reset Password' : 'Login'}</h2>

                        {/* KEEP YOUR MESSAGES */}
                        {(error || googleError || loginError) && <div className="status-message error">❌ {error || googleError || loginError}</div>}
                        {forgotMessage && <div className="status-message success">✅ {forgotMessage}</div>}

                        {showForgot ? (
                            /* KEEP YOUR FORGOT HANDLER */
                            <form onSubmit={handleForgotPassword}>
                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                </div>
                                <button className="main-button" type="submit">SEND RESET LINK</button>
                                <p style={{ marginTop: '20px' }}>
                                    <span style={{ color: '#00d2ff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setShowForgot(false); setForgotMessage(''); }}>
                                        Back to Login
                                    </span>
                                </p>
                            </form>
                        ) : (
                            /* KEEP YOUR LOGIN HANDLER */
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Username / Email</label>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label>Password</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '-10px' }}>
                                    <span style={{ color: '#00d2ff', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => setShowForgot(true)}>
                                        Forgot Password?
                                    </span>
                                </div>
                                <button className="main-button" type="submit" disabled={loading}>
                                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                                </button>

                                {/* KEEP YOUR GOOGLE HANDLER */}
                                <button type="button" onClick={handleGoogleLogin} style={{ marginTop: '15px', width: '100%', padding: '12px', borderRadius: '50px', border: '1px solid #444', background: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <img src="https://www.google.com/favicon.ico" width="16" alt="G" />
                                    Continue with Google
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* 3. SLIDING OVERLAY  */}
                <div className="overlay-container">
                    <div className="overlay">
                        {/* Left side (visible when Registering) */}
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome to apna School!</h1>
                            <p>Lets Makes Someone's Future <br />start journey with us</p>
                            <button className="ghost-button" onClick={() => { setIsLogin(true); setShowForgot(false); setLoginError(''); setRegError(''); setRegMessage(''); }}>SIGN IN</button>
                        </div>
                        {/* Right side (visible when Logging in) */}
                        <div className="overlay-panel overlay-right">
                            <h1>Welcome To Apna School Managament !</h1>
                            <p>Let's Manage Your School <br />Efficiently & Digitaly</p>
                            <button className="ghost-button" onClick={() => { setIsLogin(false); setLoginError(''); setRegError(''); }}>SIGN UP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;