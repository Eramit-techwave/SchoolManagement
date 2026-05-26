import React from 'react';
import { useAuth } from '../AuthContext';

function UserProfile() {
    const { authData } = useAuth();

    const styles = {
        container: { padding: '30px 45px', maxWidth: '800px', margin: '0 auto' },
        header: { marginBottom: '30px' },
        title: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        desc: { color: '#64748b', fontSize: '13px', marginTop: '6px' },
        panel: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px', marginBottom: '20px' },
        panelTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' },
        value: { padding: '12px 14px', background: '#f0f9ff', borderRadius: '10px', fontSize: '14px', color: '#475569', fontWeight: '600' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>My Profile</h1>
                <p style={styles.desc}>View and manage your account information</p>
            </div>

            <div style={styles.panel}>
                <div style={styles.panelTitle}>👤 Account Information</div>
                <div style={styles.grid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <div style={styles.value}>{authData?.username || '—'}</div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Role</label>
                        <div style={styles.value}>{authData?.role || 'User'}</div>
                    </div>
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
