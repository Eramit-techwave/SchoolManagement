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
            setIsSuccess(response.data.match !== false);
        } catch (error) {
            setMessage('Encryption Error: Unable to connect with server!');
            setIsSuccess(false);
        }
        setLoading(false);
    };

    const styles = {
        container: { padding: '30px 50px', background: '#fdfdfd', minHeight: '100vh' },
        pageHeader: { marginBottom: '30px' },
        pageHeaderTitle: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        pageHeaderDesc: { color: '#64748b', fontSize: '13px', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' },
        scannerGrid: { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' },
        controlPanel: { background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: 'fit-content' },
        viewportContainer: { background: '#0f172a', borderRadius: '30px', padding: '15px', border: '4px solid #f1f5f9', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
        inputLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' },
        techInput: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 15px', color: '#1e293b', outline: 'none', transition: '0.3s', fontSize: '14px' },
        btnStack: { display: 'flex', flexDirection: 'column', gap: '12px' },
        actionBtn: { padding: '14px', borderRadius: '12px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer', transition: '0.3s', border: 'none', fontSize: '13px', letterSpacing: '1px' },
        verifyBtn: { background: '#00d2ff', color: '#0f172a' },
        regBtn: { background: '#0f172a', color: '#00d2ff', border: '1px solid #00d2ff' },
        statusBox: { marginTop: '25px', padding: '15px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', textAlign: 'center', lineHeight: '1.4' },
        statusSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        statusError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },
        loadingPulse: { color: '#00d2ff', fontWeight: '800', textAlign: 'center', marginTop: '10px', fontSize: '12px' },
        webcam: { width: '100%', height: '520px', objectFit: 'cover', borderRadius: '20px' },
        scannerOverlay: { position: 'absolute', width: '300px', height: '200px', border: '2px solid #00d2ff', borderRadius: '100px', boxShadow: '0 0 0 2000px rgba(15, 23, 42, 0.7)', pointerEvents: 'none', zIndex: 10 },
        feedLabel: { position: 'absolute', bottom: '20px', left: '20px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '10px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <h1 style={styles.pageHeaderTitle}>Biometric Eye Scanner</h1>
                <p style={styles.pageHeaderDesc}>Sub-millimeter iris pattern recognition system</p>
            </div>

            <div style={styles.scannerGrid}>
                {/* CONTROL PANEL */}
                <div style={styles.controlPanel}>
                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Identity Level</label>
                        <select 
                            style={styles.techInput} 
                            value={userType} 
                            onChange={e => setUserType(e.target.value)}
                        >
                            <option value="student">STUDENT_IDENT</option>
                            <option value="teacher">STAFF_IDENT</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Authorized UID</label>
                        <input 
                            style={styles.techInput}
                            type="text" 
                            placeholder="ENTER DATABASE ID" 
                            value={userId} 
                            onChange={e => setUserId(e.target.value)}
                        />
                    </div>

                    <div style={styles.btnStack}>
                        <button 
                            style={{...styles.actionBtn, ...styles.verifyBtn}} 
                            onClick={() => capture('verify')} 
                            disabled={loading}
                        >
                            👁️ Start Verification
                        </button>
                        <button 
                            style={{...styles.actionBtn, ...styles.regBtn}} 
                            onClick={() => capture('register')} 
                            disabled={loading}
                        >
                            📸 Register Iris Pattern
                        </button>
                    </div>

                    {loading && <div style={styles.loadingPulse}>ANALYZING IRIS PATTERN...</div>}

                    {message && (
                        <div style={{...styles.statusBox, ...(isSuccess ? styles.statusSuccess : styles.statusError)}}>
                            {isSuccess ? '✅ AUTH_SUCCESS: ' : '❌ AUTH_FAILED: '} {message}
                        </div>
                    )}
                </div>

                {/* SCANNER VIEWPORT */}
                <div style={styles.viewportContainer}>
                    <div style={styles.scannerOverlay}></div>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                        style={styles.webcam}
                    />
                    <div style={styles.feedLabel}>
                        SECURE_FEED_STATED // PID_{Math.floor(Math.random() * 9000) + 1000}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EyeScanner;
