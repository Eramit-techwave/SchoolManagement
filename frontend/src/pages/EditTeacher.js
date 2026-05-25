import React, { useState, useEffect } from 'react';
import { updateTeacher } from '../api';

function EditTeacher() {
    const id = window.location.pathname.split('/').pop();
    const [form, setForm] = useState({
        name: '', date_of_birth: '', gender: '', blood_group: '',
        religion: '', aadhar_number: '', role: 'Teacher', department: '',
        subject: '', qualification: '', experience: '', joining_date: '',
        salary: '', email: '', phone: '', address: '',
        emergency_name: '', emergency_phone: '', emergency_relation: '',
        is_active: true
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

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
            setForm(data);
        } catch (error) {
            setMessage('Error loading teacher!');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined) {
                    formData.append(key, form[key]);
                }
            });
            await updateTeacher(id, formData);
            setMessage('Staff updated successfully!');
            setIsError(false);
        } catch (error) {
            setMessage('Error updating staff!');
            setIsError(true);
        }
    };

    if (loading) return <div className="page-container"><p>⏳ Loading...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ Edit Staff</h1>
                <p>Update staff information</p>
            </div>

            {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                    {isError ? '❌' : '✅'} {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>👤 Personal Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input type="text" value={form.name || ''}
                                onChange={e => setForm({...form, name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value={form.date_of_birth || ''}
                                onChange={e => setForm({...form, date_of_birth: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={form.gender || ''}
                                onChange={e => setForm({...form, gender: e.target.value})}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Blood Group</label>
                            <select value={form.blood_group || ''}
                                onChange={e => setForm({...form, blood_group: e.target.value})}>
                                <option value="">Select</option>
                                <option>A+</option><option>A-</option>
                                <option>B+</option><option>B-</option>
                                <option>O+</option><option>O-</option>
                                <option>AB+</option><option>AB-</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Aadhaar Number</label>
                            <input type="text" maxLength="12" value={form.aadhar_number || ''}
                                onChange={e => setForm({...form, aadhar_number: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>💼 Job Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Role</label>
                            <select value={form.role || ''}
                                onChange={e => setForm({...form, role: e.target.value})}>
                                <option>Teacher</option>
                                <option>Principal</option>
                                <option>Librarian</option>
                                <option>Accountant</option>
                                <option>Security Guard</option>
                                <option>Driver</option>
                                <option>Peon</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" value={form.department || ''}
                                onChange={e => setForm({...form, department: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input type="text" value={form.subject || ''}
                                onChange={e => setForm({...form, subject: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Qualification</label>
                            <input type="text" value={form.qualification || ''}
                                onChange={e => setForm({...form, qualification: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input type="number" value={form.experience || ''}
                                onChange={e => setForm({...form, experience: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Joining Date</label>
                            <input type="date" value={form.joining_date || ''}
                                onChange={e => setForm({...form, joining_date: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Salary</label>
                            <input type="number" value={form.salary || ''}
                                onChange={e => setForm({...form, salary: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select value={form.is_active}
                                onChange={e => setForm({...form, is_active: e.target.value === 'true'})}>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>📞 Contact Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={form.email || ''}
                                onChange={e => setForm({...form, email: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" value={form.phone || ''}
                                onChange={e => setForm({...form, phone: e.target.value})} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Address</label>
                            <input type="text" value={form.address || ''}
                                onChange={e => setForm({...form, address: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🚨 Emergency Contact</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Contact Name</label>
                            <input type="text" value={form.emergency_name || ''}
                                onChange={e => setForm({...form, emergency_name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input type="text" value={form.emergency_phone || ''}
                                onChange={e => setForm({...form, emergency_phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Relation</label>
                            <input type="text" value={form.emergency_relation || ''}
                                onChange={e => setForm({...form, emergency_relation: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
                    <button type="submit" className="btn btn-success"
                        style={{ padding: '12px 30px', fontSize: '16px' }}>
                        💾 Save Changes
                    </button>
                    <a href={`/teachers/${id}`} className="btn btn-primary"
                        style={{ padding: '12px 30px', fontSize: '16px' }}>
                        ← Back to Profile
                    </a>
                </div>
            </form>
        </div>
    );
}

export default EditTeacher;