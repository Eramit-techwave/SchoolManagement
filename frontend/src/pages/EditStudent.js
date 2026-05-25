import React, { useState, useEffect } from 'react';
import { getStudent, updateStudent } from '../api';

function EditStudent() {
    const id = window.location.pathname.split('/').pop();
    const [form, setForm] = useState({
        name: '', roll_number: '', class_name: '', section: '',
        date_of_birth: '', gender: '', blood_group: '', religion: '',
        aadhar_number: '', admission_number: '', admission_date: '',
        previous_school: '', email: '', phone: '', address: '',
        father_name: '', father_phone: '', mother_name: '', mother_phone: '',
        parent_email: '', bus_route: '', hostel: false, hostel_room: '',
        is_active: true
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const response = await getStudent(id);
            setForm(response.data);
        } catch (error) {
            setMessage('Error loading student!');
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
            await updateStudent(id, formData);
            setMessage('Student updated successfully!');
            setIsError(false);
        } catch (error) {
            setMessage('Error updating student!');
            setIsError(true);
        }
    };

    if (loading) return <div className="page-container"><p>⏳ Loading...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>✏️ Edit Student</h1>
                <p>Update student information</p>
            </div>

            {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                    {isError ? '❌' : '✅'} {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Personal Info */}
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
                            <label>Religion</label>
                            <input type="text" value={form.religion || ''}
                                onChange={e => setForm({...form, religion: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Aadhar Number</label>
                            <input type="text" maxLength="12" value={form.aadhar_number || ''}
                                onChange={e => setForm({...form, aadhar_number: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* School Info */}
                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🏫 School Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Roll Number *</label>
                            <input type="text" value={form.roll_number || ''}
                                onChange={e => setForm({...form, roll_number: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Admission Number</label>
                            <input type="text" value={form.admission_number || ''}
                                onChange={e => setForm({...form, admission_number: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Class *</label>
                            <input type="text" value={form.class_name || ''}
                                onChange={e => setForm({...form, class_name: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Section</label>
                            <input type="text" value={form.section || ''}
                                onChange={e => setForm({...form, section: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Admission Date</label>
                            <input type="date" value={form.admission_date || ''}
                                onChange={e => setForm({...form, admission_date: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Previous School</label>
                            <input type="text" value={form.previous_school || ''}
                                onChange={e => setForm({...form, previous_school: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
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

                {/* Parent Info */}
                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>👨‍👩‍👧 Parent Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Father's Name</label>
                            <input type="text" value={form.father_name || ''}
                                onChange={e => setForm({...form, father_name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Father's Phone</label>
                            <input type="text" value={form.father_phone || ''}
                                onChange={e => setForm({...form, father_phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Mother's Name</label>
                            <input type="text" value={form.mother_name || ''}
                                onChange={e => setForm({...form, mother_name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Mother's Phone</label>
                            <input type="text" value={form.mother_phone || ''}
                                onChange={e => setForm({...form, mother_phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Parent Email</label>
                            <input type="email" value={form.parent_email || ''}
                                onChange={e => setForm({...form, parent_email: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Transport */}
                <div className="card">
                    <h2 style={{ color: '#1F4E79', marginBottom: '20px' }}>🚌 Transport & Hostel</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Bus Route</label>
                            <input type="text" value={form.bus_route || ''}
                                onChange={e => setForm({...form, bus_route: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Hostel</label>
                            <select value={form.hostel}
                                onChange={e => setForm({...form, hostel: e.target.value === 'true'})}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        {form.hostel && (
                            <div className="form-group">
                                <label>Room Number</label>
                                <input type="text" value={form.hostel_room || ''}
                                    onChange={e => setForm({...form, hostel_room: e.target.value})} />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
                    <button type="submit" className="btn btn-success"
                        style={{ padding: '12px 30px', fontSize: '16px' }}>
                        💾 Save Changes
                    </button>
                    <a href={`/students/${id}`} className="btn btn-primary"
                        style={{ padding: '12px 30px', fontSize: '16px' }}>
                        ← Back to Profile
                    </a>
                </div>
            </form>
        </div>
    );
}

export default EditStudent;