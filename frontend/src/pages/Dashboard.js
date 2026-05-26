import React, { useState, useEffect } from 'react';
import { getStudents, getTeachers, getAttendance } from '../api';
import { useAuth } from '../AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const role = user?.role;

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [recentStudents, setRecentStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([]);

    // Real-time clock system
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { 
        loadData();
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        const defaultNotifs = [
            { id: 1, title: 'System Status', msg: 'All systems operational', type: 'success', time: 'Now' },
            { id: 2, title: 'Welcome Back', msg: `Welcome ${user?.username}, System Ready`, type: 'info', time: '2m ago' }
        ];
        setNotifications(defaultNotifs);
    };

    const loadData = async () => {
        try {
            const [s, t, a] = await Promise.all([getStudents(), getTeachers(), getAttendance()]);
            setTotalStudents(s.data.length);
            setTotalTeachers(t.data.length);
            setTotalAttendance(a.data.length);
            setRecentStudents(s.data.slice(-5).reverse());
        } catch (error) { console.error("Sync Error"); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f7fa', fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'auto', padding: '20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&family=JetBrains+Mono:wght@500&display=swap');
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                /* HEADER */
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: white;
                    padding: 20px 30px;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .header-title h1 {
                    font-size: 26px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0;
                }
                
                .header-title p {
                    font-size: 13px;
                    color: #64748b;
                    margin: 5px 0 0 0;
                }
                
                .header-clock {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 24px;
                    font-weight: 800;
                    color: #00d2ff;
                    background: #0f172a;
                    padding: 12px 20px;
                    border-radius: 10px;
                    letter-spacing: 1px;
                }
                
                /* STATS GRID */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                
                .stat-card:hover {
                    border-color: #00d2ff;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 16px rgba(0,210,255,0.1);
                }
                
                .stat-label {
                    font-size: 11px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                
                .stat-value {
                    font-size: 32px;
                    font-weight: 800;
                    color: #0f172a;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                /* GRID LAYOUT */
                .content-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 15px;
                    flex: 1;
                    min-height: 0;
                }
                
                .panel {
                    background: white;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                
                .panel-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #f1f5f9;
                }
                
                .panel-title {
                    font-size: 13px;
                    font-weight: 800;
                    color: #0f172a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .panel-dot {
                    width: 8px;
                    height: 8px;
                    background: #00d2ff;
                    border-radius: 50%;
                }
                
                .table-container {
                    overflow-y: auto;
                    flex: 1;
                }
                
                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 13px;
                }
                
                .custom-table th {
                    padding: 10px;
                    text-align: left;
                    font-size: 11px;
                    color: #94a3b8;
                    text-transform: uppercase;
                    font-weight: 700;
                    border-bottom: 1px solid #f1f5f9;
                    background: #fafafa;
                    position: sticky;
                    top: 0;
                }
                
                .custom-table td {
                    padding: 12px 10px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #475569;
                }
                
                .custom-table tr:hover {
                    background: #f8fafc;
                }
                
                .name-strong {
                    font-weight: 700;
                    color: #0f172a;
                }
                
                /* NOTIFICATIONS */
                .notif-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                    overflow-y: auto;
                }
                
                .notif-item {
                    background: #f8fafc;
                    padding: 12px;
                    border-radius: 10px;
                    border-left: 4px solid #00d2ff;
                    font-size: 12px;
                }
                
                .notif-item.success {
                    border-left-color: #10b981;
                }
                
                .notif-item.warning {
                    border-left-color: #f59e0b;
                }
                
                .notif-title {
                    font-weight: 700;
                    color: #0f172a;
                    display: block;
                    margin-bottom: 3px;
                    font-size: 13px;
                }
                
                .notif-text {
                    color: #64748b;
                    margin-bottom: 3px;
                }
                
                .notif-time {
                    font-size: 11px;
                    color: #94a3b8;
                }
                
                @media (max-width: 1200px) {
                    .content-grid { grid-template-columns: 1fr; }
                    .stats-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
                }
                
                @media (max-width: 768px) {
                    .dashboard-header { flex-direction: column; align-items: flex-start; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .header-title h1 { font-size: 20px; }
                }
                
                @media (max-width: 480px) {
                    .header-title h1 { font-size: 18px; }
                    .header-clock { font-size: 16px; padding: 8px 12px; }
                    .content-grid { grid-template-columns: 1fr; gap: 10px; }
                    .panel { padding: 15px; }
                }
            `}</style>

            {/* HEADER */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Apna School Management</h1>
                    <p>Welcome, <strong>{user?.username}</strong> • Role: <strong>{role?.toUpperCase()}</strong></p>
                </div>
                <div className="header-clock">
                    ⏰ {currentTime.toLocaleTimeString()}
                </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Students</div>
                    <div className="stat-value">{loading ? '...' : totalStudents}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Faculty Members</div>
                    <div className="stat-value">{loading ? '...' : totalTeachers}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Attendance Records</div>
                    <div className="stat-value" style={{color: '#10b981'}}>{loading ? '...' : totalAttendance}</div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="content-grid">
                {/* RECENT STUDENTS PANEL */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-dot"></div>
                        <div className="panel-title">Recent Registrations</div>
                    </div>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th>Class</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>Loading...</td></tr>
                                ) : recentStudents.length > 0 ? (
                                    recentStudents.map(s => (
                                        <tr key={s.id}>
                                            <td><span className="name-strong">{s.name}</span></td>
                                            <td>{s.roll_number}</td>
                                            <td>{s.class_name || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#94a3b8'}}>No students yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NOTIFICATIONS PANEL */}
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-dot"></div>
                        <div className="panel-title">Notifications</div>
                    </div>
                    <div className="notif-list">
                        {notifications.map(n => (
                            <div key={n.id} className={`notif-item ${n.type}`}>
                                <span className="notif-title">{n.title}</span>
                                <span className="notif-text">{n.msg}</span>
                                <span className="notif-time">{n.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
