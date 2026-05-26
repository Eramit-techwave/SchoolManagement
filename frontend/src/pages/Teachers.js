import React, { useState, useEffect } from 'react';
import { getTeachers, deleteTeacher } from '../api';

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error("Error loading teachers:", error);
            setError('Failed to load teachers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
            try {
                await deleteTeacher(id);
                setDeleteMessage('Staff member deleted successfully!');
                setTimeout(() => setDeleteMessage(''), 3000);
                loadTeachers();
            } catch (error) {
                console.error("Delete error:", error);
                setError('Failed to delete staff member. Please try again.');
            }
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.role?.toLowerCase().includes(search.toLowerCase()) ||
        t.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&family=JetBrains+Mono:wght@500&display=swap');

                * { box-sizing: border-box; }

                .tech-shell {
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b;
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden;
                }

                /* 🛰️ SIDEBAR NAVIGATION */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                    flex-shrink: 0;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0;
                }
                .nav-link:hover, .nav-link.active {
                    color: #00d2ff; background: rgba(0, 210, 255, 0.1); transform: translateX(3px);
                }

                /* 🖥️ MAIN VIEWPORT */
                .main-content {
                    flex: 1; padding: 30px 40px; overflow-y: auto; background: #fdfdfd;
                    display: flex; flex-direction: column;
                }

                /* 🔍 HEADER & SEARCH & ADD BUTTON */
                .page-head {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 35px; flex-wrap: wrap; gap: 15px;
                }
                .page-head > div:first-child { flex: 1; min-width: 200px; }
                .search-box {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px;
                    padding: 10px 20px; display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); min-width: 250px;
                }
                .search-box input {
                    background: transparent; border: none; color: #1e293b; outline: none;
                    font-size: 14px; width: 100%; flex: 1;
                }

                .add-btn {
                    background: #0f172a; color: #00d2ff; padding: 11px 22px;
                    border-radius: 11px; text-decoration: none; font-size: 13px; font-weight: 800;
                    transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px;
                    border: 1px solid #0f172a; white-space: nowrap; flex-shrink: 0;
                }
                .add-btn:hover {
                    background: #00d2ff; color: #0f172a; transform: translateY(-2px);
                    box-shadow: 0 8px 15px rgba(0, 210, 255, 0.2);
                }

                /* 🧩 STAFF CARDS */
                .list-container { flex: 1; overflow-y: auto; padding-right: 10px; }
                .staff-row {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px;
                    margin-bottom: 16px; padding: 16px 18px; display: grid;
                    grid-template-columns: 1.2fr 1fr 1fr 0.9fr 1.2fr;
                    gap: 15px; align-items: center; transition: 0.3s;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
                }
                .staff-row:hover {
                    border-color: #00d2ff; transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(0, 210, 255, 0.1);
                }

                .data-panel {
                    background: #f8fafc; border-radius: 14px; padding: 12px 16px;
                    display: flex; flex-direction: column; justify-content: center;
                    border: 1px solid #f1f5f9; min-height: 60px;
                }
                .label { font-size: 10px; color: #94a3b8; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
                }
                .value { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }

                .id-panel { background: transparent; border: none; padding-left: 8px; }
                .id-name { font-size: 16px; font-weight: 800; color: #0f172a; display: block;
                    margin-bottom: 2px; word-break: break-word;
                }
                .id-role { font-family: 'JetBrains Mono'; font-size: 11px; color: #0088cc;
                    font-weight: 600;
                }

                .status-chip {
                    font-size: 10px; font-weight: 800; padding: 6px 11px; border-radius: 8px;
                    align-self: flex-start; letter-spacing: 0.5px; white-space: nowrap;
                    background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5;
                }
                .offline { background: #fef2f2; color: #ef4444; border-color: #fee2e2; }

                /* ACTION GROUP */
                .action-group {
                    display: flex; gap: 8px; align-items: center; justify-content: flex-end;
                    flex-wrap: wrap; min-width: 130px;
                }
                .btn-icon {
                    width: 38px; height: 38px; border-radius: 10px; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    background: #fff; cursor: pointer; text-decoration: none; transition: 0.2s;
                    font-size: 15px; flex-shrink: 0;
                }
                .btn-view:hover { background: #f0f9ff; color: #00d2ff; border-color: #00d2ff; }
                .btn-edit:hover { background: #f8fafc; color: #0f172a; border-color: #0f172a; }
                .btn-del:hover { background: #fff1f2; color: #ef4444; border-color: #fecaca; }

                /* MESSAGES */
                .alert-box {
                    padding: 14px 18px; border-radius: 12px; margin-bottom: 20px;
                    font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 10px;
                }
                .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

                .loader {
                    text-align: center; padding: 60px 20px; color: #94a3b8;
                    font-weight: 600; letter-spacing: 1px; align-self: center;
                }

                /* MOBILE RESPONSIVENESS */
                @media (max-width: 1200px) {
                    .staff-row {
                        grid-template-columns: 1fr 1fr 1fr 0.8fr;
                    }
                    .data-panel { min-height: 55px; padding: 10px 14px; }
                }

                @media (max-width: 1024px) {
                    .main-content { padding: 20px 25px; }
                    .staff-row {
                        grid-template-columns: 1.2fr 1fr 1fr;
                        gap: 12px; padding: 14px;
                    }
                    .page-head { flex-direction: column; align-items: stretch; }
                    .add-btn { width: 100%; text-align: center; }
                    .status-chip { font-size: 9px; padding: 5px 9px; }
                }

                @media (max-width: 768px) {
                    .sidebar { width: 60px; padding: 20px 0; gap: 15px; }
                    .nav-link { width: 44px; height: 44px; font-size: 18px; }
                    .main-content { padding: 18px 16px; }
                    .page-head { flex-direction: column; align-items: stretch; margin-bottom: 20px; gap: 12px; }
                    .search-box { width: 100%; min-width: auto; }
                    .add-btn { width: 100%; text-align: center; padding: 10px 15px; font-size: 12px; }
                    .staff-row {
                        grid-template-columns: 1fr;
                        gap: 10px; padding: 14px;
                    }
                    .data-panel { min-height: auto; padding: 10px 12px; }
                    .action-group {
                        justify-content: space-around; min-width: 100%;
                    }
                    .btn-icon { width: 36px; height: 36px; font-size: 14px; }
                }

                @media (max-width: 480px) {
                    .sidebar { width: 55px; padding: 15px 0; gap: 12px; }
                    .nav-link { width: 40px; height: 40px; font-size: 16px; }
                    .main-content { padding: 14px 12px; }
                    .id-name { font-size: 14px; }
                    .id-role { font-size: 10px; }
                    .value { font-size: 13px; }
                    .label { font-size: 9px; }
                    .btn-icon { width: 34px; height: 34px; font-size: 13px; }
                }

                /* Scrollbar styling */
                .list-container::-webkit-scrollbar {
                    width: 8px;
                }
                .list-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .list-container::-webkit-scrollbar-thumb {
                    background: #cbd5e1; border-radius: 4px;
                }
                .list-container::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link" title="Dashboard">🏠</a>
                <a href="/students" className="nav-link" title="Students">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link" title="Eye Scanner">👁️</a>
                <a href="/attendance" className="nav-link" title="Attendance">📋</a>
                <a href="/teachers" className="nav-link active" title="Teachers">💼</a>
                <div style={{marginTop:'auto'}}><a href="/settings" className="nav-link" title="Settings">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT */}
            <main className="main-content">
                <div className="page-head">
                    <div>
                        <h2 style={{margin:0, fontSize:'26px', fontWeight: 800}}>Staff Directory</h2>
                        <p style={{margin:0, color:'#64748b', fontSize:'13px', marginTop: '5px'}}>
                            Manage faculty and administrative personnel
                        </p>
                    </div>
                    <div className="search-box">
                        <span style={{opacity: 0.5, fontSize: '16px'}}>🔍</span>
                        <input
                            placeholder="Search by name, role or department..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search staff"
                        />
                    </div>
                    <a href="/add-teacher" className="add-btn">
                        + Add Staff
                    </a>
                </div>

                {error && <div className="alert-box alert-error">⚠️ {error}</div>}
                {deleteMessage && <div className="alert-box alert-success">✅ {deleteMessage}</div>}

                <div className="list-container">
                    {loading ? (
                        <div className="loader">⏳ Loading staff records...</div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="loader">📭 No staff members found</div>
                    ) : (
                        filteredTeachers.map(teacher => (
                            <div className="staff-row" key={teacher.id}>
                                <div className="data-panel id-panel">
                                    <span className="id-name">{teacher.name || 'N/A'}</span>
                                    <span className="id-role">{(teacher.role || 'N/A').toUpperCase()}</span>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Department</span>
                                    <p className="value">{teacher.department || '—'}</p>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Contact</span>
                                    <p className="value">{teacher.phone || '—'}</p>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Status</span>
                                    <span className={`status-chip ${!teacher.is_active ? 'offline' : ''}`}>
                                        {teacher.is_active ? '✓ On Duty' : '✕ Off Duty'}
                                    </span>
                                </div>

                                <div className="action-group">
                                    <a href={`/teachers/${teacher.id}`} className="btn-icon btn-view" title="View Profile">👁️</a>
                                    <a href={`/edit-teacher/${teacher.id}`} className="btn-icon btn-edit" title="Edit Profile">✏️</a>
                                    <button
                                        className="btn-icon btn-del"
                                        onClick={() => handleDelete(teacher.id)}
                                        title="Delete Record"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Teachers;