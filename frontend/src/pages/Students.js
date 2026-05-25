import React, { useState, useEffect } from 'react';
import { getStudents, deleteStudent } from '../api';

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { loadStudents(); }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const response = await getStudents();
            setStudents(response.data);
        } catch (error) { console.error("Error loading students:", error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Purge this student record?')) {
            try { 
                await deleteStudent(id); 
                loadStudents(); 
            } catch (error) { alert("Delete failed!"); }
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

                /* 🧩 HORIZONTAL BENTO ROW */
                .student-row {
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px;
                    margin-bottom: 18px; padding: 12px;
                    display: grid; 
                    grid-template-columns: 1.2fr 1fr 1fr 0.8fr 120px; 
                    gap: 15px; align-items: stretch;
                    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .student-row:hover { 
                    border-color: #00d2ff; 
                    transform: translateY(-2px) scale(1.002); 
                    box-shadow: 0 12px 20px rgba(0,0,0,0.04); 
                }

                /* Mini-Panels inside the row */
                .data-panel {
                    background: #f8fafc; border-radius: 16px; padding: 12px 20px;
                    display: flex; flex-direction: column; justify-content: center;
                    border: 1px solid #f1f5f9;
                }
                .label { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
                .value { font-size: 14px; font-weight: 700; color: #334155; margin: 0; }
                
                /* Identity Styling */
                .id-panel { background: transparent; border: none; padding-left: 10px; }
                .id-name { font-size: 18px; font-weight: 800; color: #0f172a; display: block; margin-bottom: 2px; }
                .id-roll { font-family: 'JetBrains Mono'; font-size: 12px; color: #0088cc; font-weight: 600; }

                /* Status Chip */
                .status-chip {
                    font-size: 10px; font-weight: 800; padding: 5px 10px; border-radius: 8px;
                    align-self: flex-start; letter-spacing: 0.5px;
                    background: #ecfdf5; color: #10b981; border: 1px solid #d1fae5;
                }
                .offline { background: #fef2f2; color: #ef4444; border-color: #fee2e2; }

                /* Action Group */
                .action-group { display: flex; gap: 10px; align-items: center; justify-content: flex-end; }
                .btn {
                    width: 42px; height: 42px; border-radius: 12px; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    background: #fff; cursor: pointer; text-decoration: none; transition: 0.2s;
                    font-size: 18px;
                }
                .btn:hover { background: #0f172a; color: #00d2ff; border-color: #0f172a; transform: scale(1.1); }
                .btn-del:hover { background: #fff1f2; color: #ef4444; border-color: #fecaca; }

                .loader { text-align: center; padding: 100px; color: #94a3b8; font-weight: 600; letter-spacing: 2px; }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/students" className="nav-link active">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link">👁️</a>
                <a href="/attendance" className="nav-link">📋</a>
                <a href="/teachers" className="nav-link">💼</a>
                <div style={{marginTop:'auto'}}><a href="/settings" className="nav-link">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT */}
            <main className="main-content">
                <div className="page-head">
                    <div>
                        <h2 style={{margin:0, fontSize:'26px', fontWeight: 800}}>Student Registry</h2>
                        <p style={{margin:0, color:'#64748b', fontSize:'14px'}}>Secure identity database management</p>
                    </div>
                    <div className="search-box">
                        <span style={{opacity: 0.4}}>🔍</span>
                        <input 
                            placeholder="Filter by name or roll number..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="list-container">
                    {loading ? (
                        <div className="loader">INITIALIZING DATA FETCH...</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="loader">NO MATCHING IDENTITIES FOUND</div>
                    ) : (
                        filteredStudents.map(student => (
                            <div className="student-row" key={student.id}>
                                {/* Panel 1: Identity */}
                                <div className="data-panel id-panel">
                                    <span className="id-name">{student.name}</span>
                                    <span className="id-roll">UID: {student.roll_number}</span>
                                </div>

                                {/* Panel 2: Academic Group */}
                                <div className="data-panel">
                                    <span className="label">Classification</span>
                                    <p className="value">Grade {student.class_name} • Sec {student.section || '0'}</p>
                                </div>

                                {/* Panel 3: Contact Port */}
                                <div className="data-panel">
                                    <span className="label">Secure Contact</span>
                                    <p className="value">{student.phone || 'NO DATA'}</p>
                                </div>

                                {/* Panel 4: System Status */}
                                <div className="data-panel">
                                    <span className="label">Access Status</span>
                                    <span className={`status-chip ${!student.is_active ? 'offline' : ''}`}>
                                        {student.is_active ? '● AUTHORIZED' : '● REVOKED'}
                                    </span>
                                </div>

                                {/* Panel 5: Operations */}
                                <div className="action-group">
                                    <a href={`/students/${student.id}`} className="btn" title="View Profile">👁️</a>
                                    <button className="btn btn-del" onClick={() => handleDelete(student.id)} title="Purge Record">🗑️</button>
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