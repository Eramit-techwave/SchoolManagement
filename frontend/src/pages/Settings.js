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

    const styles = {
        container: { display: 'flex', height: '100vh', background: '#FFFFFF', color: '#1e293b', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden' },
        mainContent: { flex: 1, padding: '30px 40px', overflowY: 'auto', background: '#fdfdfd' },
        pageHeader: { marginBottom: '30px' },
        pageTitle: { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 },
        pageDesc: { color: '#64748b', fontSize: '14px', marginTop: '5px' },
        settingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' },
        settingCard: { background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
        cardTitle: { fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' },
        toggleGroup: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f8fafc', borderRadius: '12px', marginBottom: '15px' },
        toggleLabel: { fontSize: '14px', fontWeight: 600, color: '#1e293b' },
        toggleDescription: { fontSize: '12px', color: '#94a3b8', marginTop: '3px' },
        toggleSwitch: (active) => ({ width: '50px', height: '28px', background: active ? '#10b981' : '#e2e8f0', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: '0.3s', display: 'flex', alignItems: 'center', padding: '2px' }),
        toggleKnob: (active) => ({ width: '24px', height: '24px', background: 'white', borderRadius: '50%', transition: '0.3s', transform: active ? 'translateX(22px)' : 'none' }),
        buttonGroup: { display: 'flex', gap: '15px' },
        btnPrimary: { flex: 1, padding: '12px 20px', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase', background: '#0f172a', color: '#00d2ff' },
        btnSecondary: { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer' },
        btnDanger: { background: '#e53935', color: 'white', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer' },
        formGroup: { marginBottom: '15px' },
        formLabel: { display: 'block', fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' },
        formInput: { width: '100%', padding: '10px 15px', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: '#f8fafc' },
        messageSuccess: { padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', background: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5' },
        messageError: { padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', background: '#fff1f2', color: '#e11d48', border: '1px solid #fee2e2' }
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
        <div style={styles.container}>
            <main style={styles.mainContent}>
                <div className="page-header">
                    <h1 style={styles.pageTitle}>Settings</h1>
                    <p style={styles.pageDesc}>Customize your school management experience</p>
                </div>
                {message && (
                    <div style={message.includes('successfully') ? styles.messageSuccess : styles.messageError}>
                        {message}
                    </div>
                )}

                <div style={styles.settingsGrid}>
                    {/* PREFERENCES CARD */}
                    <div style={styles.settingCard}>
                        <h2 style={styles.cardTitle}><span></span> Preferences</h2>

                        <div style={styles.toggleGroup}>
                            <div>
                                <div style={styles.toggleLabel}>Notifications</div>
                                <div style={styles.toggleDescription}>Receive system alerts</div>
                            </div>
                            <button
                                style={styles.toggleSwitch(notifications)}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <div style={styles.toggleKnob(notifications)}></div>
                            </button>
                        </div>

                        <div style={styles.toggleGroup}>
                            <div>
                                <div style={styles.toggleLabel}>Auto-Refresh</div>
                                <div style={styles.toggleDescription}>Refresh data automatically</div>
                            </div>
                            <button
                                style={styles.toggleSwitch(autoRefresh)}
                                onClick={() => setAutoRefresh(!autoRefresh)}
                            >
                                <div style={styles.toggleKnob(autoRefresh)}></div>
                            </button>
                        </div>

                        <div style={styles.buttonGroup}>
                            <button style={styles.btnPrimary} onClick={handleSaveSettings}>
                                Save Settings
                            </button>
                        </div>
                    </div>

                    {/* SECURITY CARD */}
                    <div style={styles.settingCard}>
                        <h2 style={styles.cardTitle}><span></span> Security</h2>

                        {!showChangePassword ? (
                            <button
                                style={{ ...styles.btnPrimary, width: '100%' }}
                                onClick={() => setShowChangePassword(true)}
                            >
                                Change Password
                            </button>
                        ) : (
                            <form onSubmit={handleChangePassword}>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.oldPassword}
                                        onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                        required
                                        style={styles.formInput}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                        required
                                        style={styles.formInput}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.formLabel}>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                        required
                                        style={styles.formInput}
                                    />
                                </div>
                                <div style={styles.buttonGroup}>
                                    <button type="submit" style={styles.btnPrimary}>
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        style={styles.btnSecondary}
                                        onClick={() => setShowChangePassword(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* ACCOUNT CARD */}
                    <div style={styles.settingCard}>
                        <h2 style={styles.cardTitle}><span></span> Account</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                            Logged in as: <strong>{user?.username}</strong> ({user?.role})
                        </p>
                        <div style={styles.buttonGroup}>
                            <button style={styles.btnDanger} onClick={logout}>
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
