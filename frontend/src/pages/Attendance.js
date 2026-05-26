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

    const studentsOnLeave = attendance.filter(a => 
        a.date === new Date().toISOString().split('T')[0] && a.status === 'Absent'
    );

    const styles = {
        container: { padding: '25px 30px', background: '#fdfdfd', minHeight: '100vh' },
        header: { marginBottom: '20px' },
        headerTitle: { margin: 0, fontWeight: 800, fontSize: '24px', color: '#0f172a' },
        headerDesc: { margin: 0, color: '#64748b', fontSize: '13px' },
        statusTag: { color: '#10b981', fontWeight: 600 },
        tripleGrid: { display: 'grid', gridTemplateColumns: '0.8fr 1.2fr 1fr', gap: '20px', minHeight: 'calc(100vh - 200px)' },
        panel: { background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
        panelTitle: { fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase' },
        panelTitleDot: { width: '8px', height: '8px', background: '#00d2ff', borderRadius: '50%' },
        panelTitleDotRed: { width: '8px', height: '8px', background: '#e11d48', borderRadius: '50%' },
        techInput: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 15px', color: '#1e293b', outline: 'none', transition: '0.3s', fontSize: '13px', width: '100%', marginBottom: '15px' },
        label: { fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' },
        submitBtn: { width: '100%', padding: '14px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', marginTop: 'auto' },
        techTable: { width: '100%', borderCollapse: 'collapse' },
        techTableHead: { textAlign: 'left', padding: '10px', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' },
        techTableRow: { padding: '12px 10px', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
        badge: { padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800' },
        badgePresent: { background: '#ecfdf5', color: '#10b981' },
        badgeAbsent: { background: '#fff1f2', color: '#e11d48' },
        leaveCard: { background: '#fff1f2', border: '1px solid #fee2e2', borderRadius: '14px', padding: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        leaveName: { fontWeight: '700', color: '#e11d48', fontSize: '14px' },
        leaveSub: { fontSize: '11px', color: '#fb7185', fontFamily: 'monospace' },
        msgBox: { fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#10b981' },
        msgError: { color: '#dc2626' },
        emptyState: { textAlign: 'center', padding: '40px', color: '#cbd5e1', fontSize: '12px' },
        leaveCounter: { marginTop: 'auto', padding: '10px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', fontSize: '11px', color: '#64748b' }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.headerTitle}>Attendance Command</h2>
                <p style={styles.headerDesc}>System Status: <span style={styles.statusTag}>ENCRYPTED_LIVE</span></p>
            </header>

            <div style={styles.tripleGrid}>
                {/* PANEL 1: ENTRY FORM */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> LOG_ENTRY</div>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                        <label style={styles.label}>STUDENT_ID</label>
                        <select 
                            style={styles.techInput} 
                            value={form.student} 
                            onChange={e => setForm({...form, student: e.target.value})} 
                            required
                        >
                            <option value="">Identify Target</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>

                        <label style={styles.label}>AUTH_TEACHER</label>
                        <select 
                            style={styles.techInput} 
                            value={form.teacher} 
                            onChange={e => setForm({...form, teacher: e.target.value})} 
                            required
                        >
                            <option value="">Identify Teacher</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>

                        <label style={styles.label}>STATUS</label>
                        <select 
                            style={styles.techInput} 
                            value={form.status} 
                            onChange={e => setForm({...form, status: e.target.value})}
                        >
                            <option value="Present">PRESENT</option>
                            <option value="Absent">ABSENT</option>
                            <option value="Late">LATE_ENTRY</option>
                        </select>

                        <button type="submit" style={styles.submitBtn}>EXECUTE LOG</button>
                        {message && <p style={{...styles.msgBox, ...(isError ? styles.msgError : {})}}>{message}</p>}
                    </form>
                </div>

                {/* PANEL 2: LIVE FEED */}
                <div style={{...styles.panel, overflow: 'hidden'}}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> LIVE_ATTENDANCE_FEED</div>
                    <div style={{overflowY: 'auto'}}>
                        <table style={styles.techTable}>
                            <thead>
                                <tr>
                                    <th style={styles.techTableHead}>IDENTITY</th>
                                    <th style={styles.techTableHead}>DATE</th>
                                    <th style={styles.techTableHead}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.slice(-10).reverse().map(a => (
                                    <tr key={a.id}>
                                        <td style={{...styles.techTableRow, fontWeight: 700}}>
                                            {students.find(s => s.id === a.student)?.name || 'User'}
                                        </td>
                                        <td style={{...styles.techTableRow, fontFamily: 'monospace', fontSize: '11px'}}>
                                            {a.date}
                                        </td>
                                        <td style={styles.techTableRow}>
                                            <span style={{...styles.badge, ...(a.status === 'Present' ? styles.badgePresent : styles.badgeAbsent)}}>
                                                {a.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PANEL 3: LEAVE MONITOR */}
                <div style={styles.panel}>
                    <div style={{...styles.panelTitle, color: '#e11d48'}}>
                        <span style={styles.panelTitleDotRed}></span> LEAVE_MONITOR_TODAY
                    </div>
                    <div style={{overflowY: 'auto'}}>
                        {studentsOnLeave.length === 0 ? (
                            <div style={styles.emptyState}>ALL_STUDENTS_ACCOUNTED_FOR</div>
                        ) : (
                            studentsOnLeave.map(a => (
                                <div key={a.id} style={styles.leaveCard}>
                                    <div>
                                        <div style={styles.leaveName}>
                                            {students.find(s => s.id === a.student)?.name}
                                        </div>
                                        <div style={styles.leaveSub}>
                                            CLASS: {students.find(s => s.id === a.student)?.class_name}
                                        </div>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <span style={{fontSize: '10px', color: '#e11d48', fontWeight: 800}}>OFF_CAMPUS</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div style={styles.leaveCounter}>
                        TOTAL_ON_LEAVE: <strong>{studentsOnLeave.length}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Attendance;
