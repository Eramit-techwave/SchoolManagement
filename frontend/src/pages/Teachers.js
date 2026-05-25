import React, { useState, useEffect } from 'react';
import { getTeachers, deleteTeacher } from '../api';

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error("Error loading teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await deleteTeacher(id);
                loadTeachers();
            } catch (error) {
                alert("Delete fail ho gaya!");
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

                .tech-shell { 
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b; 
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; 
                }

                /* 🛰️ SIDEBAR NAVIGATION */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-link:hover, .nav-link.active { 
                    color: #00d2ff; background: rgba(0, 210, 255, 0.1); transform: translateX(3px);
                }

                /* 🖥️ MAIN VIEWPORT */
                .main-content { flex: 1; padding: 30px 40px; overflow-y: auto; background: #fdfdfd; }

                /* 🔍 HEADER & SEARCH */
                .page-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 35px; }
                .search-box {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px;
                    padding: 10px 20px; width: 450px; display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .search-box input {
                    background: transparent; border: none; color: #1e293b; outline: none; font-size: 15px; width: 100%;
                }

                .add-btn {
                    background: #0f172a; color: #00d2ff; padding: 12px 24px;
                    border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 800;
                    transition: 0.3s; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .add-btn:hover { background: #00d2ff; color: #0f172a; transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 210, 255, 0.2); }

                /* 🧩 HORIZONTAL BENTO ROW (Consistent with Students) */
                .staff-row {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px;
                    margin-bottom: 18px; padding: 12px;
                    display: grid; 
                    grid-template-columns: 1.2fr 1fr 1fr 0.8fr 140px; 
                    gap: 15px; align-items: stretch;
                    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .staff-row:hover { 
                    border-color: #00d2ff; 
                    transform: translateY(-2px) scale(1.002); 
                    box-shadow: 0 12px 20px rgba(0,0,0,0.04); 
                }

                .data-panel {
                    background: #f8fafc; border-radius: 16px; padding: 12px 20px;
                    display: flex; flex-direction: column; justify-content: center;
                    border: 1px solid #f1f5f9;
                }
                .label { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
                .value { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }
                
                .id-panel { background: transparent; border: none; padding-left: 10px; }
                .id-name { font-size: 18px; font-weight: 800; color: #0f172a; display: block; margin-bottom: 2px; }
                .id-role { font-family: 'JetBrains Mono'; font-size: 12px; color: #0088cc; font-weight: 600; }

                .status-chip {
                    font-size: 10px; font-weight: 800; padding: 5px 10px; border-radius: 8px;
                    align-self: flex-start; letter-spacing: 0.5px;
                    background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5;
                }
                .offline { background: #fef2f2; color: #ef4444; border-color: #fee2e2; }

                .action-group { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
                .btn-icon {
                    width: 40px; height: 40px; border-radius: 11px; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    background: #fff; cursor: pointer; text-decoration: none; transition: 0.2s;
                    font-size: 16px;
                }
                .btn-view:hover { background: #f0f9ff; color: #00d2ff; border-color: #00d2ff; }
                .btn-edit:hover { background: #f8fafc; color: #0f172a; }
                .btn-del:hover { background: #fff1f2; color: #ef4444; border-color: #fecaca; }

                .loader { text-align: center; padding: 100px; color: #94a3b8; font-weight: 600; letter-spacing: 1px; }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/students" className="nav-link">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link">👁️</a>
                <a href="/attendance" className="nav-link">📋</a>
                <a href="/teachers" className="nav-link active">💼</a>
                <div style={{marginTop:'auto'}}><a href="/settings" className="nav-link">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT */}
            <main className="main-content">
                <div className="page-head">
                    <div>
                        <h2 style={{margin:0, fontSize:'26px', fontWeight: 800}}>Staff Directory</h2>
                        <p style={{margin:0, color:'#64748b', fontSize:'14px'}}>Manage faculty and administrative personnel</p>
                    </div>
                    <div className="search-box">
                        <span style={{opacity: 0.4}}>🔍</span>
                        <input 
                            placeholder="Filter by name, role or department..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <a href="/add-teacher" className="add-btn">
                        + Add Staff
                    </a>
                </div>

                <div className="list-container">
                    {loading ? (
                        <div className="loader">FETCHING STAFF RECORDS...</div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="loader">NO STAFF MEMBERS FOUND</div>
                    ) : (
                        filteredTeachers.map(teacher => (
                            <div className="staff-row" key={teacher.id}>
                                {/* Identity Panel */}
                                <div className="data-panel id-panel">
                                    <span className="id-name">{teacher.name}</span>
                                    <span className="id-role">{teacher.role.toUpperCase()}</span>
                                </div>

                                {/* Dept Panel */}
                                <div className="data-panel">
                                    <span className="label">Department</span>
                                    <p className="value">{teacher.department || 'GENERAL'}</p>
                                </div>

                                {/* Contact Panel */}
                                <div className="data-panel">
                                    <span className="label">Secure Contact</span>
                                    <p className="value">{teacher.phone || 'N/A'}</p>
                                </div>

                                {/* Status Panel */}
                                <div className="data-panel">
                                    <span className="label">Duty Status</span>
                                    <span className={`status-chip ${!teacher.is_active ? 'offline' : ''}`}>
                                        {teacher.is_active ? '● ON DUTY' : '● OFF DUTY'}
                                    </span>
                                </div>

                                {/* Actions Panel */}
                                <div className="action-group">
                                    <a href={`/teachers/${teacher.id}`} className="btn-icon btn-view" title="View Profile">👁️</a>
                                    <a href={`/edit-teacher/${teacher.id}`} className="btn-icon btn-edit" title="Edit Profile">✏️</a>
                                    <button className="btn-icon btn-del" onClick={() => handleDelete(teacher.id)} title="Remove Staff">🗑️</button>
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