import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

function UserProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setProfile(response.data);
            setFormData({
                username: response.data.username || '',
                email: response.data.email || '',
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('Failed to load profile');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/auth/profile/', formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setProfile(response.data);
            setMessage('✅ Profile updated successfully!');
            setIsError(false);
            setEditing(false);
        } catch (error) {
            setMessage('⚠️ Error updating profile');
            setIsError(true);
        }
    };

    const styles = {
        container: { padding: '30px 45px', maxWidth: '800px', margin: '0 auto' },
        pageHeader: { marginBottom: '30px' },
        pageHeaderTitle: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        pageHeaderDesc: { color: '#64748b', fontSize: '13px', marginTop: '6px' },
        profileCard: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '20px' },
        profileHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' },
        profileTitle: { fontSize: '18px', fontWeight: '800', color: '#0f172a' },
        editBtn: { padding: '10px 20px', background: '#00d2ff', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
        cancelBtn: { padding: '10px 20px', background: '#e2e8f0', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginRight: '10px', transition: '0.3s' },
        saveBtn: { padding: '10px 20px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.3s' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
        input: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', color: '#1e293b', fontSize: '14px', width: '100%', transition: '0.3s' },
        inputReadOnly: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', color: '#1e293b', fontSize: '14px', width: '100%', backgroundColor: '#f1f5f9' },
        info: { background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 14px', color: '#1e40af', fontSize: '13px', marginBottom: '15px' },
        alert: { padding: '12px 14px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
        alertSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        alertError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },
        loadingContainer: { padding: '30px 45px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }
    };

    if (loading) {
        return <div style={styles.loadingContainer}><p>Loading profile...</p></div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <h1 style={styles.pageHeaderTitle}>My Profile</h1>
                <p style={styles.pageHeaderDesc}>View and manage your profile information</p>
            </div>

            {message && (
                <div style={{...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess)}}>
                    {message}
                </div>
            )}

            <div style={styles.profileCard}>
                <div style={styles.profileHeader}>
                    <div style={styles.profileTitle}>Profile Information</div>
                    {!editing ? (
                        <button style={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit</button>
                    ) : null}
                </div>

                {profile && (
                    <form onSubmit={handleSubmit}>
                        <div style={styles.info}>
                            👤 Username: <strong>{profile.username}</strong> | Role: <strong>{profile.role}</strong>
                        </div>

                        <div style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    style={styles.inputReadOnly}
                                    disabled
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter first name"
                                    disabled={!editing}
                                />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="Enter last name"
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                            {editing ? (
                                <>
                                    <button type="submit" style={styles.saveBtn}>✓ Save Changes</button>
                                    <button type="button" style={styles.cancelBtn} onClick={() => {
                                        setEditing(false);
                                        setMessage('');
                                    }}>Cancel</button>
                                </>
                            ) : null}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
