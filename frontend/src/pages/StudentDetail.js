import React, { useState, useEffect } from 'react';
import { getStudent } from '../api';

function StudentDetail() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const id = window.location.pathname.split('/').pop();

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const response = await getStudent(id);
            setStudent(response.data);
        } catch (error) {
            console.error("Error loading student:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container"><p>⏳ Loading...</p></div>;
    if (!student) return <div className="page-container"><p>Student not found!</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>👨‍🎓 Student Profile</h1>
                <p>Complete student information</p>
            </div>

            {/* Top Card - Photo + Basic Info */}
            <div className="card" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: '#EBF3FB', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '50px', flexShrink: 0
                }}>
                    {student.photo ? 
                        <img src={`http://127.0.0.1:8000${student.photo}`} 
                             alt="Student" 
                             style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                        : '👨‍🎓'
                    }
                </div>
                <div>
                    <h2 style={{ color: '#1F4E79', fontSize: '24px' }}>{student.name}</h2>
                    <p style={{ color: '#888', marginTop: '5px' }}>
                        Roll No: <strong>{student.roll_number}</strong> | 
                        Class: <strong>{student.class_name} {student.section}</strong>
                    </p>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <span className="badge badge-success">Active</span>
                        <span className="badge badge-warning">{student.blood_group || 'N/A'}</span>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <a href={`/edit-student/${student.id}`} className="btn btn-primary">
                        ✏️ Edit Profile
                    </a>
                </div>
            </div>

            {/* Personal Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>👤 Personal Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Full Name</label><p><strong>{student.name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Date of Birth</label><p><strong>{student.date_of_birth || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Gender</label><p><strong>{student.gender || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Blood Group</label><p><strong>{student.blood_group || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Religion</label><p><strong>{student.religion || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Aadhar Number</label><p><strong>{student.aadhar_number || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* School Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🏫 School Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Roll Number</label><p><strong>{student.roll_number || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Admission Number</label><p><strong>{student.admission_number || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Class</label><p><strong>{student.class_name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Section</label><p><strong>{student.section || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Admission Date</label><p><strong>{student.admission_date || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Previous School</label><p><strong>{student.previous_school || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>📞 Contact Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Email</label><p><strong>{student.email || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Phone</label><p><strong>{student.phone || 'N/A'}</strong></p></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ color: '#888', fontSize: '13px' }}>Address</label><p><strong>{student.address || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Parent Info */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>👨‍👩‍👧 Parent Information</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Father's Name</label><p><strong>{student.father_name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Father's Phone</label><p><strong>{student.father_phone || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Mother's Name</label><p><strong>{student.mother_name || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Mother's Phone</label><p><strong>{student.mother_phone || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Parent Email</label><p><strong>{student.parent_email || 'N/A'}</strong></p></div>
                </div>
            </div>

            {/* Transport & Hostel */}
            <div className="card">
                <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🚌 Transport & Hostel</h2>
                <div className="form-grid">
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Bus Route</label><p><strong>{student.bus_route || 'N/A'}</strong></p></div>
                    <div><label style={{ color: '#888', fontSize: '13px' }}>Hostel</label><p><strong>{student.hostel ? 'Yes' : 'No'}</strong></p></div>
                    {student.hostel && <div><label style={{ color: '#888', fontSize: '13px' }}>Room Number</label><p><strong>{student.hostel_room || 'N/A'}</strong></p></div>}
                </div>
            </div>

            {/* Back Button */}
            <div style={{ marginBottom: '30px' }}>
                <a href="/students" className="btn btn-primary">← Back to Students</a>
            </div>
        </div>
    );
}

export default StudentDetail;