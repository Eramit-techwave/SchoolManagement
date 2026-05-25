import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function EyeScanner() {
    const webcamRef = useRef(null);
    const [userId, setUserId] = useState('');
    const [userType, setUserType] = useState('student');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const capture = async (action) => {
        const image = webcamRef.current.getScreenshot();
        if (!image) {
            setMessage('Visual capture failed: No image found!');
            setIsSuccess(false);
            return;
        }

        if (!userId) {
            setMessage('Input Required: Enter User ID first!');
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        try {
            const url = action === 'register'
                ? 'http://127.0.0.1:8000/api/eye/register/'
                : 'http://127.0.0.1:8000/api/eye/verify/';

            const response = await axios.post(url, {
                image: image,
                user_id: userId,
                user_type: userType
            });

            setMessage(response.data.message);
            // Assuming match is returned as true/false or a success message
            setIsSuccess(response.data.match !== false);
        } catch (error) {
            setMessage('Encryption Error: Unable to connect with server!');
            setIsSuccess(false);
        }
        setLoading(false);
    };

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&family=JetBrains+Mono:wght@500&display=swap');

                .tech-shell { 
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b; 
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; 
                }

                /* 🛰️ SIDEBAR NAVIGATION (Consistent with Dashboard) */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px; transition: 0.3s;
                }
                .nav-link:hover, .nav-link.active { color: #00d2ff; background: rgba(0, 210, 255, 0.1); }

                /* 🖥️ MAIN VIEWPORT */
                .main-content { flex: 1; padding: 30px 50px; overflow-y: auto; background: #fdfdfd; }

                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
                .page-header p { color: #64748b; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }

                /* 🧩 SCANNER BENTO LAYOUT */
                .scanner-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }

                .control-panel {
                    background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;
                    padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); height: fit-content;
                }

                .viewport-container {
                    background: #0f172a; border-radius: 30px; padding: 15px;
                    border: 4px solid #f1f5f9; position: relative; display: flex;
                    justify-content: center; align-items: center; overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                /* 🎯 DIGITAL SCANNER OVERLAY */
                .scanner-overlay {
                    position: absolute; width: 300px; height: 200px;
                    border: 2px solid #00d2ff; border-radius: 100px;
                    box-shadow: 0 0 0 2000px rgba(15, 23, 42, 0.7);
                    pointer-events: none; z-index: 10;
                }
                .scanner-overlay::after {
                    content: ''; position: absolute; top: 0; left: 0; right: 0;
                    height: 2px; background: #00d2ff;
                    box-shadow: 0 0 15px #00d2ff, 0 0 30px #00d2ff;
                    animation: scan-line 2.5s infinite ease-in-out;
                }

                @keyframes scan-line { 
                    0% { top: 10%; opacity: 0; } 
                    10% { opacity: 1; }
                    50% { top: 90%; } 
                    90% { opacity: 1; }
                    100% { top: 10%; opacity: 0; } 
                }

                /* ⌨️ INPUTS */
                .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
                .input-group label { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; }
                
                .tech-input {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 12px 15px; color: #1e293b; outline: none; transition: 0.3s; font-size: 14px;
                }
                .tech-input:focus { border-color: #00d2ff; background: #fff; box-shadow: 0 0 0 4px rgba(0, 210, 255, 0.1); }

                /* 🔘 BUTTONS */
                .btn-stack { display: flex; flex-direction: column; gap: 12px; }
                .action-btn {
                    padding: 14px; border-radius: 12px; font-weight: 800; text-transform: uppercase;
                    cursor: pointer; transition: 0.3s; border: none; font-size: 13px; letter-spacing: 1px;
                }
                .reg-btn { background: #0f172a; color: #00d2ff; border: 1px solid #00d2ff; }
                .verify-btn { background: #00d2ff; color: #0f172a; }
                
                .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 210, 255, 0.2); }
                .action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                /* 🚨 STATUS BOX */
                .status-box {
                    margin-top: 25px; padding: 15px; border-radius: 12px; font-weight: 700;
                    font-size: 13px; text-align: center; line-height: 1.4;
                }
                .success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

                .loading-pulse { animation: pulse 1.5s infinite; color: #00d2ff; font-weight: 800; text-align: center; margin-top: 10px; font-size: 12px; }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/students" className="nav-link">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link active">👁️</a>
                <a href="/attendance" className="nav-link">📋</a>
                <a href="/teachers" className="nav-link">💼</a>
            </aside>

            {/* 🖥️ MAIN AREA */}
            <main className="main-content">
                <div className="page-header">
                    <h1>Biometric Eye Scanner</h1>
                    <p>Sub-millimeter iris pattern recognition system</p>
                </div>

                <div className="scanner-grid">
                    {/* CONTROL PANEL */}
                    <div className="control-panel">
                        <div className="input-group">
                            <label>Identity Level</label>
                            <select className="tech-input" value={userType} onChange={e => setUserType(e.target.value)}>
                                <option value="student">STUDENT_IDENT</option>
                                <option value="teacher">STAFF_IDENT</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Authorized UID</label>
                            <input 
                                className="tech-input" 
                                type="text" 
                                placeholder="ENTER DATABASE ID" 
                                value={userId} 
                                onChange={e => setUserId(e.target.value)}
                            />
                        </div>

                        <div className="btn-stack">
                            <button className="action-btn verify-btn" onClick={() => capture('verify')} disabled={loading}>
                                👁️ Start Verification
                            </button>
                            <button className="action-btn reg-btn" onClick={() => capture('register')} disabled={loading}>
                                📸 Register Iris Pattern
                            </button>
                        </div>

                        {loading && <div className="loading-pulse">ANALYZING IRIS PATTERN...</div>}

                        {message && (
                            <div className={`status-box ${isSuccess ? 'success' : 'error'}`}>
                                {isSuccess ? '✅ AUTH_SUCCESS: ' : '❌ AUTH_FAILED: '} {message}
                            </div>
                        )}
                    </div>

                    {/* SCANNER VIEWPORT */}
                    <div className="viewport-container">
                        <div className="scanner-overlay"></div>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                            style={{ 
                                width: '100%',
                                height: '520px',
                                objectFit: 'cover',
                                borderRadius: '20px'
                            }}
                        />
                        <div style={{position:'absolute', bottom:'20px', left:'20px', color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono', fontSize:'10px'}}>
                            SECURE_FEED_STATED // PID_{Math.floor(Math.random() * 9000) + 1000}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default EyeScanner;