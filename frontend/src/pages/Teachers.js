import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeachers, deleteTeacher } from '../api';

function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');

    useEffect(() => { loadTeachers(); }, []);

    const loadTeachers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getTeachers();
            setTeachers(response.data);
        } catch (error) {
            console.error("Error loading teachers:", error);
            setError('Failed to load faculty. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff record? This action cannot be undone.')) {
            try {
                await deleteTeacher(id);
                setDeleteMessage('✅ Staff member deleted successfully!');
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
        t.department?.toLowerCase().includes(search.toLowerCase())
    );

    const styles = {
        container: { padding: '30px 40px' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' },
        headerTitle: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        headerDesc: { color: '#64748b', fontSize: '13px', marginTop: '4px' },
        addBtn: { padding: '12px 24px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', transition: '0.3s', display: 'inline-block' },
        searchBox: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', minWidth: '250px' },
        searchInput: { background: 'transparent', border: 'none', color: '#1e293b', outline: 'none', fontSize: '14px', width: '100%', flex: 1 },
        listContainer: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
        teacherRow: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', marginBottom: '16px', padding: '16px 18px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.9fr 1fr', gap: '15px', alignItems: 'center', transition: '0.3s' },
        teacherInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
        teacherPhoto: { width: '50px', height: '50px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid #bfdbfe', flexShrink: 0 },
        teacherName: { fontWeight: '700', color: '#0f172a' },
        teacherDept: { color: '#64748b', fontSize: '12px' },
        badge: { display: 'inline-block', padding: '4px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '12px', fontWeight: '600' },
        actionBtns: { display: 'flex', gap: '8px' },
        viewBtn: { padding: '6px 12px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '6px', fontWeight: '600', fontSize: '11px', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', transition: '0.3s', display: 'inline-block' },
        deleteBtn: { padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444', borderRadius: '6px', fontWeight: '600', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase', transition: '0.3s' },
        emptyState: { textAlign: 'center', padding: '60px 20px', color: '#94a3b8' },
        loading: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
        alert: { padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '13px' },
        alertSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        alertError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.headerTitle}>Faculty & Staff</h1>
                    <p style={styles.headerDesc}>Manage faculty and administrative staff</p>
                </div>
                <Link to="/add-teacher" style={styles.addBtn}>➕ Add Staff</Link>
            </div>

            {deleteMessage && <div style={{...styles.alert, ...styles.alertSuccess}}>{deleteMessage}</div>}
            {error && <div style={{...styles.alert, ...styles.alertError}}>{error}</div>}

            <div style={styles.searchBox}>
                <span style={{color: '#94a3b8', fontSize: '16px'}}>🔍</span>
                <input
                    type="text"
                    placeholder="Search by name or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.listContainer}>
                {loading ? (
                    <div style={styles.loading}>Loading faculty...</div>
                ) : filteredTeachers.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{fontSize: '40px'}}>👨‍🏫</p>
                        <p>No faculty found</p>
                        <p style={{fontSize: '12px'}}>Add new staff to get started</p>
                    </div>
                ) : (
                    filteredTeachers.map(teacher => (
                        <div key={teacher.id} style={styles.teacherRow}>
                            <div style={styles.teacherInfo}>
                                <div style={styles.teacherPhoto}>👤</div>
                                <div>
                                    <div style={styles.teacherName}>{teacher.name}</div>
                                    <div style={styles.teacherDept}>{teacher.role || 'Staff'}</div>
                                </div>
                            </div>
                            <div>
                                {teacher.department || '—'}
                                <div style={{fontSize: '12px', color: '#94a3b8'}}>Department</div>
                            </div>
                            <div>
                                {teacher.email || '—'}
                                <div style={{fontSize: '12px', color: '#94a3b8'}}>Email</div>
                            </div>
                            <div>
                                <span style={styles.badge}>{teacher.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                            <div style={styles.actionBtns}>
                                <Link to={`/teacher/${teacher.id}`} style={styles.viewBtn}>View</Link>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(teacher.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Teachers;
