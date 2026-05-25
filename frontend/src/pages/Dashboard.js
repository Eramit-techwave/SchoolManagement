import React, { useState, useEffect } from 'react';
import { getStudents, getTeachers, getAttendance } from '../api';
import { useAuth } from '../AuthContext'; // 1. AuthContext import karo

function Dashboard() {
    const { user } = useAuth(); // 2. User ka data nikaalo (isme role hai)
    const role = user?.role;

    const [totalStudents, setTotalStudents] = useState(0);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [recentStudents, setRecentStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

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
        <div className="tech-shell">
            <style>{`
                /* ... (Saari CSS wahi rahegi jo pehle thi) ... */
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&family=JetBrains+Mono:wght@500&display=swap');
                .tech-shell { display: flex; height: 100vh; background: #FFFFFF; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; }
                .sidebar { width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px; }
                .nav-link { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px; transition: all 0.3s; }
                .nav-link:hover, .nav-link.active { color: #00d2ff; background: rgba(0, 210, 255, 0.1); transform: translateX(3px); }
                .main-content { flex: 1; padding: 30px 40px; overflow-y: auto; background: #fdfdfd; }
                .top-bar { display: flex; gap: 12px; margin-bottom: 30px; padding: 15px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .action-btn { padding: 10px 20px; background: #f8fafc; color: #475569; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 700; border: 1px solid #e2e8f0; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .action-btn:hover { background: #0f172a; color: #00d2ff; border-color: #0f172a; transform: translateY(-2px); }
                .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
                .stat-card { background: #ffffff; padding: 25px; border-radius: 18px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; transition: 0.3s; }
                .stat-card:hover { border-color: #00d2ff; transform: translateY(-3px); }
                .stat-card .val { font-family: 'JetBrains Mono', monospace; font-size: 36px; font-weight: 800; color: #0f172a; margin: 5px 0; }
                .stat-card .lab { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
                .bento-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; height: auto; }
                .panel { background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; padding: 25px; display: flex; flex-direction: column; min-height: 400px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .panel-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
                .panel-title span { width: 10px; height: 10px; background: #00d2ff; border-radius: 3px; }
                .custom-table { width: 100%; border-collapse: collapse; }
                .custom-table th { text-align: left; padding: 12px; font-size: 11px; color: #94a3b8; text-transform: uppercase; }
                .row-item { transition: 0.2s; border-bottom: 1px solid #f1f5f9; }
                .row-item:hover { background: #f0f9ff; }
                .row-item td { padding: 15px 12px; font-size: 14px; color: #475569; }
                .name-txt { font-weight: 700; color: #1e293b; }
                .notif-item { background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid #00d2ff; font-size: 13px; color: #475569; }
                .notif-item strong { display: block; color: #0f172a; margin-bottom: 3px; font-size: 14px; }
                .placeholder-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; border: 2px dashed #e2e8f0; border-radius: 20px; color: #94a3b8; }
            `}</style>

            {/* 🛰️ FIXED SIDEBAR (ROLE-BASED) */}
            <aside className="sidebar">
                <a href="/" className="nav-link active" title="Dashboard">🏠</a>

                {/* Sirf Admin aur Teacher ko dikhao Students link */}
                {(role === 'admin' || role === 'teacher') && (
                    <a href="/students" className="nav-link" title="Students">👨‍🎓</a>
                )}

                {/* Sirf Admin ko dikhao Eye Scanner aur Teachers link */}
                {role === 'admin' && (
                    <>
                        <a href="/eye-scanner" className="nav-link" title="Biometric">👁️</a>
                        <a href="/teachers" className="nav-link" title="Staff">💼</a>
                    </>
                )}

                <a href="/attendance" className="nav-link" title="Attendance">📋</a>
                <div style={{ marginTop: 'auto' }}><a href="/settings" className="nav-link">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN VIEW */}
            <main className="main-content">
                <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Apna School Control Center</h2>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Logged in as: <strong>{user?.username}</strong> ({role})</p>
                    </div>
                    <div style={{ background: '#0f172a', color: '#00d2ff', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                        SYSTEM_ONLINE • 2026
                    </div>
                </header>

                {/* ⚡ ACTION ROW (ROLE-BASED) */}
                <div className="top-bar">
                    {/* Sirf Admin ko hi register karne ka option milega */}
                    {role === 'admin' && (
                        <>
                            <a href="/add-student" className="action-btn"><span>➕</span> Register Student</a>
                            <a href="/eye-scanner" className="action-btn"><span>👁️</span> Eye Scanner</a>
                        </>
                    )}

                    {/* Teacher aur Admin dono attendance mark kar sakte hain */}
                    {(role === 'admin' || role === 'teacher') && (
                        <a href="/attendance" className="action-btn"><span>📝</span> Mark Attendance</a>
                    )}

                    <a href="/students" className="action-btn"><span>📁</span> Access Database</a>
                </div>

                {/* 📊 STATS (Sabke liye alag view ho sakta hai, par abhi sabko dikhao) */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="lab">Total Enrollment</span>
                        <span className="val">{loading ? '..' : totalStudents}</span>
                    </div>
                    <div className="stat-card">
                        <span className="lab">Academic Faculty</span>
                        <span className="val">{loading ? '..' : totalTeachers}</span>
                    </div>
                    <div className="stat-card">
                        <span className="lab">Logs Verified</span>
                        <span className="val" style={{ color: '#10b981' }}>{loading ? '..' : totalAttendance}</span>
                    </div>
                </div>

                {/* 🧩 3-PART GRID */}
                <div className="bento-grid">
                    <div className="panel">
                        <div className="panel-title"><span></span> RECENT_ADMISSIONS</div>
                        <div style={{ overflowY: 'auto' }}>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>IDENTITY</th>
                                        <th>ROLL_ID</th>
                                        <th>CLASS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Syncing...</td></tr>
                                    ) : (
                                        recentStudents.map(s => (
                                            <tr key={s.id} className="row-item">
                                                <td><span className="name-txt">{s.name}</span></td>
                                                <td style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>{s.roll_number}</td>
                                                <td><span style={{ fontSize: '12px', fontWeight: '700', color: '#0088cc' }}>{s.class_name}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-title"><span></span> LIVE_ALERTS</div>
                        <div className="notif-item">
                            <strong>Database Synched</strong>
                            System successfully connected to the main server.
                        </div>
                        <div className="notif-item" style={{ borderLeftColor: '#10b981' }}>
                            <strong>Biometric Ready</strong>
                            Eye scanner is calibrated and waiting for input.
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-title"><span></span> FUTURE_MODULES</div>
                        <div className="placeholder-area">
                            <div style={{ fontSize: '30px', marginBottom: '10px' }}>⚙️</div>
                            <span>RESERVED FOR ANALYTICS</span>
                            <small style={{ fontSize: '10px', marginTop: '5px' }}>Module under development</small>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;