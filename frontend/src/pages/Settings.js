import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

function Settings() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [message, setMessage] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSaveSettings = () => {
        // Save to localStorage
        localStorage.setItem('notifications', notifications);
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('autoRefresh', autoRefresh);
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }
        // TODO: Add API call to change password
        setMessage('Password change functionality coming soon!');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowChangePassword(false);
    };

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&display=swap');

                .tech-shell {
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b;
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden;
                }

                /* SIDEBAR */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px; transition: 0.3s;
                }
                .nav-link:hover, .nav-link.active { color: #00d2ff; background: rgba(0, 210, 255, 0.1); }

                /* MAIN CONTENT */
                .main-content { flex: 1; padding: 30px 40px; overflow-y: auto; background: #fdfdfd; }

                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
                .page-header p { color: #64748b; font-size: 14px; margin-top: 5px; }

                /* SETTINGS GRID */
                .settings-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                }

                /* SETTING CARD */
                .setting-card {
                    background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0;
                    padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }

                .card-title {
                    font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 20px 0;
                    display: flex; align-items: center; gap: 10px;
                }

                .card-title span {
                    width: 10px; height: 10px; background: #00d2ff; border-radius: 50%;
                }

                /* TOGGLE SWITCH */
                .toggle-group {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 15px; background: #f8fafc; border-radius: 12px; margin-bottom: 15px;
                }

                .toggle-label {
                    font-size: 14px; font-weight: 600; color: #1e293b;
                }

                .toggle-description {
                    font-size: 12px; color: #94a3b8; margin-top: 3px;
                }

                .toggle-switch {
                    width: 50px; height: 28px; background: #e2e8f0; border-radius: 14px;
                    border: none; cursor: pointer; position: relative; transition: 0.3s;
                    display: flex; align-items: center; padding: 2px;
                }

                .toggle-switch.active {
                    background: #10b981;
                }

                .toggle-knob {
                    width: 24px; height: 24px; background: white; border-radius: 50%;
                    transition: 0.3s;
                }

                .toggle-switch.active .toggle-knob {
                    transform: translateX(22px);
                }

                /* BUTTONS */
                .button-group {
                    display: flex; gap: 15px;
                }

                .btn {
                    flex: 1; padding: 12px 20px; border: none; border-radius: 12px;
                    font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s;
                    text-transform: uppercase;
                }

                .btn-primary {
                    background: #0f172a; color: #00d2ff;
                }

                .btn-primary:hover { background: #00d2ff; color: #0f172a; }

                .btn-secondary {
                    background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0;
                }

                .btn-secondary:hover { background: #e2e8f0; }

                .btn-danger {
                    background: #e53935; color: white; flex: 0 1 auto;
                }

                .btn-danger:hover { background: #c62828; }

                /* FORM GROUP */
                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block; font-size: 12px; font-weight: 800; color: #64748b;
                    text-transform: uppercase; margin-bottom: 8px;
                }

                .form-group input {
                    width: 100%; padding: 10px 15px; border: 1px solid #e2e8f0;
                    border-radius: 12px; font-size: 14px; background: #f8fafc;
                    transition: 0.3s;
                }

                .form-group input:focus {
                    outline: none; border-color: #00d2ff; background: #ffffff;
                }

                /* MESSAGE */
                .message {
                    padding: 15px; border-radius: 12px; margin-bottom: 20px; font-size: 14px;
                    text-align: center;
                }

                .message.success { background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5; }
                .message.error { background: #fff1f2; color: #e11d48; border: 1px solid #fee2e2; }
            `}</style>

            <aside className="sidebar">
                <a href="/" className="nav-link" title="Dashboard">🏠</a>
                <a href="/settings" className="nav-link active" title="Settings">⚙️</a>
                <div style={{ marginTop: 'auto' }}>
                    <a href="/profile" className="nav-link" title="Profile">👤</a>
                </div>
            </aside>

            <main className="main-content">
                <div className="page-header">
                    <h1>Settings</h1>
                    <p>Customize your school management experience</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="settings-grid">
                    {/* PREFERENCES CARD */}
                    <div className="setting-card">
                        <h2 className="card-title"><span></span> Preferences</h2>

                        <div className="toggle-group">
                            <div>
                                <div className="toggle-label">Notifications</div>
                                <div className="toggle-description">Receive system alerts</div>
                            </div>
                            <button
                                className={`toggle-switch ${notifications ? 'active' : ''}`}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <div className="toggle-knob"></div>
                            </button>
                        </div>

                        <div className="toggle-group">
                            <div>
                                <div className="toggle-label">Auto-Refresh</div>
                                <div className="toggle-description">Refresh data automatically</div>
                            </div>
                            <button
                                className={`toggle-switch ${autoRefresh ? 'active' : ''}`}
                                onClick={() => setAutoRefresh(!autoRefresh)}
                            >
                                <div className="toggle-knob"></div>
                            </button>
                        </div>

                        <div className="button-group">
                            <button className="btn btn-primary" onClick={handleSaveSettings}>
                                Save Settings
                            </button>
                        </div>
                    </div>

                    {/* SECURITY CARD */}
                    <div className="setting-card">
                        <h2 className="card-title"><span></span> Security</h2>

                        {!showChangePassword ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowChangePassword(true)}
                                style={{ width: '100%' }}
                            >
                                Change Password
                            </button>
                        ) : (
                            <form onSubmit={handleChangePassword}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.oldPassword}
                                        onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="button-group">
                                    <button type="submit" className="btn btn-primary">
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowChangePassword(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* ACCOUNT CARD */}
                    <div className="setting-card">
                        <h2 className="card-title"><span></span> Account</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                            Logged in as: <strong>{user?.username}</strong> ({user?.role})
                        </p>
                        <div className="button-group">
                            <button className="btn btn-danger" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Settings;
