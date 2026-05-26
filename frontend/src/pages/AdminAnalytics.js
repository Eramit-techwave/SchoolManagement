import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axios from 'axios';

function AdminAnalytics() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [daysFilter, setDaysFilter] = useState(7);
    const [activeTab, setActiveTab] = useState('overview');
    const [pendingStudents, setPendingStudents] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAnalytics, setUserAnalytics] = useState(null);

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        
        fetchAnalytics();
    }, [user, daysFilter]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://127.0.0.1:8000/api/users/admin/analytics/?days=${daysFilter}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setAnalytics(response.data);
            
            // Fetch pending students
            const pendingResponse = await axios.get(
                'http://127.0.0.1:8000/api/users/admin/pending-approvals/',
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setPendingStudents(pendingResponse.data.students || []);
            
            setError('');
        } catch (err) {
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/users/admin/analytics/user/${userId}/?days=${daysFilter}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setUserAnalytics(response.data);
        } catch (err) {
            console.error('Error fetching user details');
        }
    };

    const approveStudent = async (userId) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/users/admin/approve/${userId}/`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchAnalytics();
            alert('Student approved successfully');
        } catch (err) {
            alert('Error approving student');
        }
    };

    const rejectStudent = async (userId) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/users/admin/reject/${userId}/`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            fetchAnalytics();
            alert('Student rejected');
        } catch (err) {
            alert('Error rejecting student');
        }
    };

    if (!user || user.role !== 'admin') {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Access Denied</div>;
    }

    return (
        <div style={styles.container}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                .analytics-container {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: #f5f7fa;
                    min-height: 100vh;
                    padding: 20px;
                }
                
                .analytics-header {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #00d2ff;
                    padding: 30px;
                    border-radius: 16px;
                    margin-bottom: 30px;
                    box-shadow: 0 10px 25px rgba(0,210,255,0.15);
                }
                
                .analytics-header h1 {
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                
                .analytics-header p {
                    font-size: 14px;
                    color: #94a3b8;
                }
                
                .filter-section {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .filter-btn {
                    padding: 10px 20px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                
                .filter-btn.active {
                    background: #00d2ff;
                    color: #0f172a;
                    border-color: #00d2ff;
                }
                
                .tab-buttons {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 10px;
                }
                
                .tab-btn {
                    padding: 12px 20px;
                    background: transparent;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    font-weight: 600;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s;
                }
                
                .tab-btn.active {
                    color: #00d2ff;
                    border-bottom-color: #00d2ff;
                }
                
                .stat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                
                .stat-label {
                    font-size: 12px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                
                .stat-value {
                    font-size: 32px;
                    font-weight: 800;
                    color: #0f172a;
                }
                
                .stat-card.warning {
                    border-left: 4px solid #f97316;
                }
                
                .stat-card.success {
                    border-left: 4px solid #10b981;
                }
                
                .stat-card.info {
                    border-left: 4px solid #00d2ff;
                }
                
                .table-section {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    margin-bottom: 30px;
                }
                
                .table-header {
                    background: #f8fafc;
                    padding: 20px;
                    border-bottom: 1px solid #e2e8f0;
                    font-weight: 600;
                    color: #1e293b;
                }
                
                .table-content {
                    padding: 0;
                }
                
                .table-row {
                    padding: 15px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    hover: background #f8fafc;
                }
                
                .table-row:last-child {
                    border-bottom: none;
                }
                
                .table-row:hover {
                    background: #f8fafc;
                }
                
                .user-info {
                    flex: 1;
                }
                
                .user-name {
                    font-weight: 600;
                    color: #0f172a;
                    margin-bottom: 4px;
                }
                
                .user-detail {
                    font-size: 12px;
                    color: #94a3b8;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 10px;
                }
                
                .action-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 12px;
                    transition: all 0.3s;
                }
                
                .btn-approve {
                    background: #10b981;
                    color: white;
                }
                
                .btn-approve:hover {
                    background: #059669;
                }
                
                .btn-reject {
                    background: #ef4444;
                    color: white;
                }
                
                .btn-reject:hover {
                    background: #dc2626;
                }
                
                .btn-view {
                    background: #00d2ff;
                    color: #0f172a;
                }
                
                .btn-view:hover {
                    background: #00a8cc;
                }
                
                .badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                
                .badge-admin {
                    background: #dbeafe;
                    color: #1e40af;
                }
                
                .badge-teacher {
                    background: #dcfce7;
                    color: #166534;
                }
                
                .badge-student {
                    background: #fed7aa;
                    color: #92400e;
                }
                
                .badge-pending {
                    background: #fef3c7;
                    color: #92400e;
                    border: 1px solid #fcd34d;
                }
                
                .loading {
                    text-align: center;
                    padding: 40px;
                    color: #94a3b8;
                }
                
                .error-message {
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 15px;
                    border-radius: 10px;
                    border: 1px solid #fecaca;
                    margin-bottom: 20px;
                }
            `}</style>

            <div className="analytics-container">
                {/* HEADER */}
                <div className="analytics-header">
                    <h1>📊 Admin Analytics Dashboard</h1>
                    <p>Complete user activity tracking and system monitoring</p>
                </div>

                {/* ERROR MESSAGE */}
                {error && <div className="error-message">⚠️ {error}</div>}

                {/* FILTERS */}
                <div className="filter-section">
                    <label style={{ fontWeight: 600, color: '#1e293b' }}>Filter by:</label>
                    {[7, 14, 30, 90].map(days => (
                        <button
                            key={days}
                            className={`filter-btn ${daysFilter === days ? 'active' : ''}`}
                            onClick={() => setDaysFilter(days)}
                        >
                            Last {days} Days
                        </button>
                    ))}
                </div>

                {/* TABS */}
                <div className="tab-buttons">
                    <button 
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📈 Overview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        ⏳ Pending Approvals ({pendingStudents.length})
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'activeUsers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('activeUsers')}
                    >
                        👥 Most Active Users
                    </button>
                </div>

                {/* LOADING STATE */}
                {loading ? (
                    <div className="loading">⏳ Loading analytics...</div>
                ) : analytics ? (
                    <>
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <>
                                {/* STATISTICS CARDS */}
                                <div className="stat-grid">
                                    <div className="stat-card info">
                                        <div className="stat-label">Total Users</div>
                                        <div className="stat-value">{analytics.user_statistics.total_users}</div>
                                    </div>
                                    <div className="stat-card" style={{ borderLeft: '4px solid #1e40af' }}>
                                        <div className="stat-label">Admins</div>
                                        <div className="stat-value">{analytics.user_statistics.admins}</div>
                                    </div>
                                    <div className="stat-card" style={{ borderLeft: '4px solid #059669' }}>
                                        <div className="stat-label">Teachers</div>
                                        <div className="stat-value">{analytics.user_statistics.teachers}</div>
                                    </div>
                                    <div className="stat-card" style={{ borderLeft: '4px solid #f97316' }}>
                                        <div className="stat-label">Students</div>
                                        <div className="stat-value">{analytics.user_statistics.students}</div>
                                    </div>
                                    <div className="stat-card warning">
                                        <div className="stat-label">Pending Approvals</div>
                                        <div className="stat-value">{analytics.user_statistics.pending_approvals}</div>
                                    </div>
                                    <div className="stat-card info">
                                        <div className="stat-label">Active Sessions</div>
                                        <div className="stat-value">{analytics.session_statistics.active_sessions}</div>
                                    </div>
                                    <div className="stat-card info">
                                        <div className="stat-label">Total Activities</div>
                                        <div className="stat-value">{analytics.activity_statistics.total_activities}</div>
                                    </div>
                                    <div className="stat-card" style={{ borderLeft: '4px solid #06b6d4' }}>
                                        <div className="stat-label">Logins (24h)</div>
                                        <div className="stat-value">{analytics.activity_statistics.logins_24h}</div>
                                    </div>
                                </div>

                                {/* ACTIVITY BREAKDOWN */}
                                <div className="table-section">
                                    <div className="table-header">Activity Breakdown</div>
                                    <div className="table-content">
                                        {Object.entries(analytics.activity_statistics.activity_breakdown).map(([type, count]) => (
                                            <div className="table-row" key={type}>
                                                <div className="user-info">
                                                    <div className="user-name">{type}</div>
                                                </div>
                                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{count} activities</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* PENDING APPROVALS TAB */}
                        {activeTab === 'pending' && (
                            <div className="table-section">
                                <div className="table-header">⏳ Student Accounts Pending Approval</div>
                                <div className="table-content">
                                    {pendingStudents.length === 0 ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                            No pending student accounts
                                        </div>
                                    ) : (
                                        pendingStudents.map(student => (
                                            <div className="table-row" key={student.id}>
                                                <div className="user-info">
                                                    <div className="user-name">{student.first_name} {student.last_name}</div>
                                                    <div className="user-detail">@{student.username} • {student.email}</div>
                                                </div>
                                                <div className="action-buttons">
                                                    <button className="action-btn btn-approve" onClick={() => approveStudent(student.id)}>
                                                        ✓ Approve
                                                    </button>
                                                    <button className="action-btn btn-reject" onClick={() => rejectStudent(student.id)}>
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ACTIVE USERS TAB */}
                        {activeTab === 'activeUsers' && (
                            <div className="table-section">
                                <div className="table-header">👥 Most Active Users</div>
                                <div className="table-content">
                                    {analytics.most_active_users.map(user => (
                                        <div className="table-row" key={user.user__username}>
                                            <div className="user-info">
                                                <div className="user-name">{user.user__username}</div>
                                                <div className="user-detail">
                                                    <span className={`badge badge-${user.user__profile__role}`}>
                                                        {user.user__profile__role}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                                {user.activity_count} activities
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
    }
};

export default AdminAnalytics;
