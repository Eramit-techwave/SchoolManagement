import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

function UserProfile() {
    const { authData } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const styles = {
        container: { padding: '30px 45px', maxWidth: '800px', margin: '0 auto' },
        header: { marginBottom: '30px' },
        title: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        desc: { color: '#64748b', fontSize: '13px', marginTop: '6px' },
        panel: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px', marginBottom: '20px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' },
        input: { padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', transition: '0.3s' },
        inputReadOnly: { padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f0f9ff', color: '#475569', cursor: 'not-allowed' },
        value: { padding: '12px 14px', background: '#f0f9ff', borderRadius: '10px', fontSize: '14px', color: '#475569', fontWeight: '600' },
        btnGroup: { display: 'flex', gap: '12px' },
        button: { padding: '12px 24px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase', transition: '0.3s' },
        cancelBtn: { padding: '12px 24px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase' },
        alert: { padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '13px' },
        alertSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        alertError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <p style={styles.desc}>View and manage your account information</p>
            </div>

            {message && <div style={{...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess)}}>{message}</div>}

            <div style={styles.panel}>
                <div style={{fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>👤 Account Information</div>
                <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <div style={styles.value}>{authData?.username || '—'}</div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Role</label>
                        <div style={styles.value}>{authData?.role || 'User'}</div>
                    </div>
                </div>
            </div>

            <div style={styles.panel}>
                <div style={{fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>📧 Account Status</div>
                <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Status</label>
                        <div style={styles.value}>✅ Active</div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Member Since</label>
                        <div style={styles.value}>2026</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
