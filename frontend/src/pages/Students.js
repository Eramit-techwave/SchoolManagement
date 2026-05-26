import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../api';

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');

    useEffect(() => { loadStudents(); }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getStudents();
            setStudents(response.data);
        } catch (error) {
            console.error("Error loading students:", error);
            setError('Failed to load students. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
            try {
                await deleteStudent(id);
                setDeleteMessage('Student deleted successfully!');
                setTimeout(() => setDeleteMessage(''), 3000);
                loadStudents();
            } catch (error) {
                console.error("Delete error:", error);
                setError('Failed to delete student. Please try again.');
            }
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_number?.toLowerCase().includes(search.toLowerCase())
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

                /* 🔍 HEADER & SEARCH */
                .page-head {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 35px; flex-wrap: wrap; gap: 20px;
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

                /* 🧩 STUDENT CARDS */
                .list-container { flex: 1; overflow-y: auto; padding-right: 10px; }
                .student-row {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px;
                    margin-bottom: 16px; padding: 16px 18px; display: grid;
                    grid-template-columns: 1.2fr 1fr 1fr 0.9fr 1fr;
                    gap: 15px; align-items: center; transition: 0.3s;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
                }
                .student-row:hover {
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
                .id-roll { font-family: 'JetBrains Mono'; font-size: 11px; color: #0088cc;
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
                    display: flex; gap: 10px; align-items: center; justify-content: flex-end;
                    flex-wrap: wrap; min-width: 110px;
                }
                .btn {
                    width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    background: #fff; cursor: pointer; text-decoration: none; transition: 0.2s;
                    font-size: 16px; flex-shrink: 0;
                }
                .btn:hover {
                    background: #0f172a; color: #00d2ff; border-color: #0f172a; transform: scale(1.08);
                }
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
                    .student-row {
                        grid-template-columns: 1fr 1fr 1fr 0.8fr;
                    }
                    .data-panel { min-height: 55px; padding: 10px 14px; }
                }

                @media (max-width: 1024px) {
                    .main-content { padding: 20px 25px; }
                    .student-row {
                        grid-template-columns: 1.2fr 1fr 1fr;
                        gap: 12px; padding: 14px;
                    }
                    .data-panel:nth-child(4),
                    .data-panel:nth-child(5) {
                        grid-column: span 1;
                    }
                    .status-chip { font-size: 9px; padding: 5px 9px; }
                }

                @media (max-width: 768px) {
                    .sidebar { width: 60px; padding: 20px 0; gap: 15px; }
                    .nav-link { width: 44px; height: 44px; font-size: 18px; }
                    .main-content { padding: 18px 16px; }
                    .page-head { flex-direction: column; align-items: stretch; margin-bottom: 20px; }
                    .search-box { width: 100%; min-width: auto; }
                    .student-row {
                        grid-template-columns: 1fr;
                        gap: 10px; padding: 14px;
                    }
                    .data-panel { min-height: auto; padding: 10px 12px; }
                    .action-group {
                        justify-content: space-around; min-width: 100%;
                    }
                    .btn { width: 38px; height: 38px; font-size: 15px; }
                }

                @media (max-width: 480px) {
                    .sidebar { width: 55px; padding: 15px 0; gap: 12px; }
                    .nav-link { width: 40px; height: 40px; font-size: 16px; }
                    .main-content { padding: 14px 12px; }
                    .id-name { font-size: 14px; }
                    .id-roll { font-size: 10px; }
                    .value { font-size: 13px; }
                    .label { font-size: 9px; }
                    .btn { width: 36px; height: 36px; font-size: 14px; }
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
                <a href="/students" className="nav-link active" title="Students">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link" title="Eye Scanner">👁️</a>
                <a href="/attendance" className="nav-link" title="Attendance">📋</a>
                <a href="/teachers" className="nav-link" title="Teachers">💼</a>
                <div style={{marginTop:'auto'}}><a href="/settings" className="nav-link" title="Settings">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT */}
            <main className="main-content">
                <div className="page-head">
                    <div>
                        <h2 style={{margin:0, fontSize:'26px', fontWeight: 800}}>Student Registry</h2>
                        <p style={{margin:0, color:'#64748b', fontSize:'13px', marginTop: '5px'}}>
                            Manage student records and information
                        </p>
                    </div>
                    <div className="search-box">
                        <span style={{opacity: 0.5, fontSize: '16px'}}>🔍</span>
                        <input
                            placeholder="Search by name or roll number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search students"
                        />
                    </div>
                </div>

                {error && <div className="alert-box alert-error">⚠️ {error}</div>}
                {deleteMessage && <div className="alert-box alert-success">✅ {deleteMessage}</div>}

                <div className="list-container">
                    {loading ? (
                        <div className="loader">⏳ Loading students...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="loader">📭 No matching students found</div>
                    ) : (
                        filteredStudents.map(student => (
                            <div className="student-row" key={student.id}>
                                <div className="data-panel id-panel">
                                    <span className="id-name">{student.name || 'N/A'}</span>
                                    <span className="id-roll">Roll: {student.roll_number || 'N/A'}</span>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Class</span>
                                    <p className="value">{student.class_name || 'N/A'}</p>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Contact</span>
                                    <p className="value">{student.phone || '—'}</p>
                                </div>

                                <div className="data-panel">
                                    <span className="label">Status</span>
                                    <span className={`status-chip ${!student.is_active ? 'offline' : ''}`}>
                                        {student.is_active ? '✓ Active' : '✕ Inactive'}
                                    </span>
                                </div>

                                <div className="action-group">
                                    <a href={`/students/${student.id}`} className="btn" title="View Profile">👁️</a>
                                    <button
                                        className="btn btn-del"
                                        onClick={() => handleDelete(student.id)}
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

export default Students;