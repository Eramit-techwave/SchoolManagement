import React, { useState, useEffect } from 'react';
import { getAttendance, markAttendance, getStudents, getTeachers } from '../api';

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        student: '',
        teacher: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        marked_by_eye: false
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [a, s, t] = await Promise.all([getAttendance(), getStudents(), getTeachers()]);
            setAttendance(a.data);
            setStudents(s.data);
            setTeachers(t.data);
        } catch (error) { console.error("Sync Error"); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await markAttendance(form);
            setMessage('Log Verified!');
            setIsError(false);
            loadAll();
        } catch (error) {
            setMessage('Log Error!');
            setIsError(true);
        }
    };

    // Filter students who are marked 'Absent' or on Leave for today
    const studentsOnLeave = attendance.filter(a => 
        a.date === new Date().toISOString().split('T')[0] && a.status === 'Absent'
    );

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@500&display=swap');

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
                .nav-link.active { color: #00d2ff; background: rgba(0, 210, 255, 0.1); }

                /* MAIN */
                .main-content { flex: 1; padding: 25px 30px; overflow-y: auto; background: #fdfdfd; }

                /* 🧩 TRIPLE BENTO GRID */
                .triple-grid { 
                    display: grid; 
                    grid-template-columns: 0.8fr 1.2fr 1fr; 
                    gap: 20px; 
                    height: calc(100vh - 120px);
                }

                .panel {
                    background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0;
                    padding: 20px; display: flex; flex-direction: column;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
                .panel-title { 
                    font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 20px; 
                    display: flex; align-items: center; gap: 10px; text-transform: uppercase;
                }
                .panel-title span { width: 8px; height: 8px; background: #00d2ff; border-radius: 50%; }

                /* FORM & TABLE */
                .tech-input {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 10px 15px; color: #1e293b; outline: none; transition: 0.3s; font-size: 13px; width: 100%; margin-bottom: 15px;
                }
                .tech-input:focus { border-color: #00d2ff; background: #fff; }

                .tech-table { width: 100%; border-collapse: collapse; }
                .tech-table th { text-align: left; padding: 10px; font-size: 10px; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
                .tech-row td { padding: 12px 10px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }

                /* 🚨 LEAVE LIST STYLE */
                .leave-card {
                    background: #fff1f2; border: 1px solid #fee2e2; border-radius: 14px;
                    padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;
                }
                .leave-name { font-weight: 700; color: #e11d48; font-size: 14px; }
                .leave-sub { font-size: 11px; color: #fb7185; font-family: 'JetBrains Mono'; }

                .badge { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; }
                .bg-p { background: #ecfdf5; color: #10b981; }
                .bg-a { background: #fff1f2; color: #e11d48; }

                .submit-btn {
                    width: 100%; padding: 14px; background: #0f172a; color: #00d2ff;
                    border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .submit-btn:hover { background: #00d2ff; color: #0f172a; }

                @media (max-width: 1300px) { .triple-grid { grid-template-columns: 1fr; overflow-y: visible; height: auto; } }
            `}</style>

            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/students" className="nav-link">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link">👁️</a>
                <a href="/attendance" className="nav-link active">📋</a>
                <a href="/teachers" className="nav-link">💼</a>
            </aside>

            <main className="main-content">
                <header style={{marginBottom: '20px'}}>
                    <h2 style={{margin:0, fontWeight: 800}}>Attendance Command</h2>
                    <p style={{margin:0, color: '#64748b', fontSize: '13px'}}>System Status: <span style={{color:'#10b981'}}>ENCRYPTED_LIVE</span></p>
                </header>

                <div className="triple-grid">
                    {/* PANEL 1: ENTRY FORM */}
                    <div className="panel">
                        <div className="panel-title"><span></span> LOG_ENTRY</div>
                        <form onSubmit={handleSubmit}>
                            <label style={{fontSize:'11px', fontWeight:'800', color:'#94a3b8'}}>STUDENT_ID</label>
                            <select className="tech-input" value={form.student} onChange={e => setForm({...form, student: e.target.value})} required>
                                <option value="">Identify Target</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>

                            <label style={{fontSize:'11px', fontWeight:'800', color:'#94a3b8'}}>AUTH_TEACHER</label>
                            <select className="tech-input" value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})} required>
                                <option value="">Identify Teacher</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>

                            <label style={{fontSize:'11px', fontWeight:'800', color:'#94a3b8'}}>STATUS</label>
                            <select className="tech-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                <option value="Present">PRESENT</option>
                                <option value="Absent">ABSENT</option>
                                <option value="Late">LATE_ENTRY</option>
                            </select>

                            <button type="submit" className="submit-btn">EXECUTE LOG</button>
                            {message && <p style={{fontSize:'12px', textAlign:'center', marginTop:'10px', color: isError ? 'red' : 'green'}}>{message}</p>}
                        </form>
                    </div>

                    {/* PANEL 2: LIVE FEED */}
                    <div className="panel" style={{overflow:'hidden'}}>
                        <div className="panel-title"><span></span> LIVE_ATTENDANCE_FEED</div>
                        <div style={{overflowY: 'auto'}}>
                            <table className="tech-table">
                                <thead>
                                    <tr>
                                        <th>IDENTITY</th>
                                        <th>DATE</th>
                                        <th>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.slice(-10).reverse().map(a => (
                                        <tr key={a.id} className="tech-row">
                                            <td style={{fontWeight:700}}>{students.find(s => s.id === a.student)?.name || 'User'}</td>
                                            <td style={{fontFamily:'JetBrains Mono', fontSize:'11px'}}>{a.date}</td>
                                            <td><span className={`badge ${a.status === 'Present' ? 'bg-p' : 'bg-a'}`}>{a.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PANEL 3: LEAVE MONITOR (NEW SECTION) */}
                    <div className="panel">
                        <div className="panel-title" style={{color: '#e11d48'}}><span style={{background:'#e11d48'}}></span> LEAVE_MONITOR_TODAY</div>
                        <div style={{overflowY: 'auto'}}>
                            {studentsOnLeave.length === 0 ? (
                                <div style={{textAlign:'center', padding:'40px', color:'#cbd5e1', fontSize:'12px'}}>ALL_STUDENTS_ACCOUNTED_FOR</div>
                            ) : (
                                studentsOnLeave.map(a => (
                                    <div className="leave-card" key={a.id}>
                                        <div>
                                            <div className="leave-name">{students.find(s => s.id === a.student)?.name}</div>
                                            <div className="leave-sub">CLASS: {students.find(s => s.id === a.student)?.class_name}</div>
                                        </div>
                                        <div style={{textAlign:'right'}}>
                                            <span style={{fontSize:'10px', color:'#e11d48', fontWeight:800}}>OFF_CAMPUS</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{marginTop:'auto', padding:'10px', background:'#f8fafc', borderRadius:'12px', textAlign:'center'}}>
                            <span style={{fontSize:'11px', color:'#64748b'}}>TOTAL_ON_LEAVE: <strong>{studentsOnLeave.length}</strong></span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Attendance;