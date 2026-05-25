import React, { useState, useEffect } from 'react';

function TeacherDetail() {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    const id = window.location.pathname.split('/').pop();

    useEffect(() => {
        loadTeacher();
    }, []);

    const loadTeacher = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/teachers/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setTeacher(data);
        } catch (error) {
            console.error("Error loading teacher:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container"><p>⏳ Loading...</p></div>;
    if (!teacher) return <div className="page-container"><p>Teacher not found!</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👨‍🏫 Staff Profile</h1>
                <p>Complete staff information</p>
            </div>

            {/* Top Card */}
            <div className="card" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: '#EBF3FB', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '50px', flexShrink: 0
                }}>
                    {teacher.photo ?
                        <img src={`http://127.0.0.1:8000${teacher.photo}`}
                             alt="Staff"
                             style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                        : '👨‍🏫'
                    }
                </div>
                <div>
                    <h2 style={{ color: '#1F4E79', fontSize: '24px' }}>{teacher.name}</h2>
                    <p style={{ color: '#888', marginTop: '5px' }}>
                        Role: <strong>{teacher.role}</strong> |
                        Department: <strong>{teacher.department || 'N/A'}</strong>
                    </p>
                    <div style={{ marginTop: '10px' }}>
                        <span className={`badge ${teacher.is_active ? 'badge-success' : 'badge-danger'}`}>
                            {teacher.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <a href={`/edit-teacher/${teacher.id}`} className="btn btn-primary">
                        ✏️ Edit Profile
                    </a>
                </div>
            </div>

            {/* Personal Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>👤 Personal Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Full Name</label><p><strong>{teacher.name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Date of Birth</label><p><strong>{teacher.date_of_birth || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Gender</label><p><strong>{teacher.gender || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Blood Group</label><p><strong>{teacher.blood_group || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Aadhar Number</label><p><strong>{teacher.aadhar_number || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Job Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>💼 Job Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Employee ID</label><p><strong>{teacher.employee_id || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Role</label><p><strong>{teacher.role || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Department</label><p><strong>{teacher.department || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Subject</label><p><strong>{teacher.subject || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Qualification</label><p><strong>{teacher.qualification || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Experience</label><p><strong>{teacher.experience || 0} Years</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Joining Date</label><p><strong>{teacher.joining_date || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Salary</label><p><strong>₹{teacher.salary || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>📞Contact Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Email</label><p><strong>{teacher.email || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Phone</label><p><strong>{teacher.phone || 'N/A'}</strong></p></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ color: '#888', fontSize: '13px' }}>Address</label><p><strong>{teacher.address || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🚨 Emergency Contact</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Name</label><p><strong>{teacher.emergency_name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Phone</label><p><strong>{teacher.emergency_phone || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Relation</label><p><strong>{teacher.emergency_relation || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Back Button */}
            <div style={{ marginBottom: '30px' }}>
                <a href="/teachers" className="btn btn-primary">← Back to Teachers</a>
            </div>
        </div>
    );
}

export default TeacherDetail;