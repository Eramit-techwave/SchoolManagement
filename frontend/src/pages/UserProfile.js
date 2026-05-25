import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

function UserProfile() {
    const { user, logout } = useAuth();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:8000/api/auth/profile/', formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setProfile(response.data);
            setMessage('Profile updated successfully!');
            setIsError(false);
            setEditing(false);
        } catch (error) {
            setMessage('Error updating profile');
            setIsError(true);
        }
    };

    if (loading) {
        return <div className="tech-shell"><main className="main-content"><p>Loading...</p></main></div>;
    }

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

                /* PROFILE CARD */
                .profile-card {
                    background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0;
                    padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    max-width: 600px;
                }
                
                .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
                .profile-avatar {
                    width: 100px; height: 100px; border-radius: 50%;
                    background: #0f172a; color: #00d2ff; display: flex; align-items: center;
                    justify-content: center; font-size: 40px; font-weight: 800;
                }
                
                .profile-info h2 { margin: 0; font-size: 20px; font-weight: 800; }
                .profile-role { font-size: 12px; color: #94a3b8; text-transform: uppercase; margin-top: 5px; }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block; font-size: 12px; font-weight: 800; color: #64748b;
                    text-transform: uppercase; margin-bottom: 8px;
                }
                
                .form-group input {
                    width: 100%; padding: 12px 15px; border: 1px solid #e2e8f0;
                    border-radius: 12px; font-size: 14px; background: #f8fafc;
                    transition: 0.3s;
                }
                
                .form-group input:focus {
                    outline: none; border-color: #00d2ff; background: #ffffff;
                }
                
                .action-buttons {
                    display: flex; gap: 15px; margin-top: 30px;
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
                
                .btn-logout {
                    background: #e53935; color: white;
                }
                
                .btn-logout:hover { background: #c62828; }
                
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
                    <h1>User Profile</h1>
                    <p>Manage your account information</p>
                </div>

                <div className="profile-card">
                    {message && (
                        <div className={`message ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}

                    <div className="profile-header">
                        <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                        <div className="profile-info">
                            <h2>{profile?.first_name} {profile?.last_name}</h2>
                            <p className="profile-role">{user?.role}</p>
                        </div>
                    </div>

                    {!editing ? (
                        <div>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={profile?.username} disabled />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={profile?.email} disabled />
                            </div>
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" value={profile?.first_name || ''} disabled />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" value={profile?.last_name || ''} disabled />
                            </div>
                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                                <button className="btn btn-logout" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input type="text" value={formData.username} disabled />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                />
                            </div>
                            <div className="action-buttons">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}

export default UserProfile;
