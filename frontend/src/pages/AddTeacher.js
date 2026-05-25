import React, { useState } from 'react';
import { addTeacher } from '../api';

function AddTeacher() {
    const [form, setForm] = useState({
        name: '', date_of_birth: '', gender: '', blood_group: '', religion: '',
        aadhar_number: '', role: 'Teacher', department: '', subject: '',
        qualification: '', experience: '', joining_date: '', salary: '',
        email: '', phone: '', address: '', emergency_name: '',
        emergency_phone: '', emergency_relation: '', is_active: true
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== '') formData.append(key, form[key]);
            });
            if (photo) formData.append('photo', photo);

            await addTeacher(formData);
            setMessage('Staff identity registered successfully!');
            setIsError(false);
        } catch (error) {
            setMessage('Encryption Error: Failed to add staff.');
            setIsError(true);
        }
    };

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&display=swap');

                .tech-shell {
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b;
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden;
                }

                /* 🛰️ SIDEBAR NAVIGATION (Consistent Dark Look) */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px; transition: 0.3s;
                }
                .nav-link:hover, .nav-link.active { color: #00d2ff; background: rgba(0, 210, 255, 0.1); }

                /* 🖥️ MAIN CONTENT AREA */
                .main-content { flex: 1; padding: 30px 50px; overflow-y: auto; background: #fdfdfd; }

                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
                .page-header p { color: #64748b; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }

                /* 🧩 FORM PANELS (Bento Grid) */
                .form-panel {
                    background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0;
                    padding: 30px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .panel-title { 
                    font-size: 14px; font-weight: 800; color: #0088cc; margin-bottom: 25px; 
                    display: flex; align-items: center; gap: 10px; text-transform: uppercase;
                }
                .panel-title span { width: 12px; height: 12px; background: #00d2ff; border-radius: 3px; }

                /* ⌨️ INPUT STYLING */
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 11px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
                
                .tech-input {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 12px 15px; color: #1e293b; outline: none; transition: 0.3s; font-size: 14px;
                }
                .tech-input:focus { border-color: #00d2ff; background: #fff; box-shadow: 0 0 0 4px rgba(0, 210, 255, 0.1); }

                /* 🔘 BUTTONS */
                .btn-row { display: flex; gap: 15px; margin-top: 10px; padding-bottom: 40px; }
                .submit-btn {
                    padding: 15px 35px; background: #0f172a; color: #00d2ff;
                    border: none; border-radius: 12px; font-weight: 800; font-size: 14px;
                    cursor: pointer; transition: 0.3s; text-transform: uppercase;
                }
                .submit-btn:hover { background: #00d2ff; color: #0f172a; transform: translateY(-2px); }
                
                .back-btn {
                    padding: 15px 35px; background: #fff; color: #64748b;
                    border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700;
                    text-decoration: none; font-size: 14px; transition: 0.3s;
                }

                .alert-box {
                    padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;
                    font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 10px;
                }
                .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/students" className="nav-link">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link">👁️</a>
                <a href="/attendance" className="nav-link">📋</a>
                <a href="/teachers" className="nav-link active">💼</a>
            </aside>

            {/* 🖥️ MAIN CONTENT */}
            <main className="main-content">
                <div className="page-header">
                    <h1>Staff Onboarding</h1>
                    <p>Register new faculty or administrative members</p>
                </div>

                {message && (
                    <div className={`alert-box ${isError ? 'alert-error' : 'alert-success'}`}>
                        {isError ? '⚠️' : '🛡️'} {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: PERSONAL */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Personal Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name *</label>
                                <input type="text" className="tech-input" placeholder="Enter name"
                                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Gender</label>
                                <select className="tech-input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                                    <option value="">Select Identity</option>
                                    <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Date of Birth</label>
                                <input type="date" className="tech-input" value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Photo</label>
                                <input type="file" className="tech-input" style={{padding: '8px'}} onChange={e => setPhoto(e.target.files[0])} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: JOB */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Professional Details</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Designation / Role</label>
                                <select className="tech-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                                    <option>Teacher</option><option>Principal</option><option>Librarian</option><option>Accountant</option><option>Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Department</label>
                                <input type="text" className="tech-input" placeholder="Ex: Science" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Subject Specialization</label>
                                <input type="text" className="tech-input" placeholder="Ex: Physics" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Monthly Salary</label>
                                <input type="number" className="tech-input" placeholder="Amount" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CONTACT */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Contact Access</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input type="text" className="tech-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Email ID</label>
                                <input type="email" className="tech-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                            <div className="input-group" style={{gridColumn: 'span 2'}}>
                                <label>Permanent Address</label>
                                <input type="text" className="tech-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: EMERGENCY */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Emergency Protocols</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Contact Person</label>
                                <input type="text" className="tech-input" value={form.emergency_name} onChange={e => setForm({...form, emergency_name: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Emergency Phone</label>
                                <input type="text" className="tech-input" value={form.emergency_phone} onChange={e => setForm({...form, emergency_phone: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Relation</label>
                                <input type="text" className="tech-input" value={form.emergency_relation} onChange={e => setForm({...form, emergency_relation: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="btn-row">
                        <button type="submit" className="submit-btn">Authorize Registration</button>
                        <a href="/teachers" className="back-btn">Cancel</a>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default AddTeacher;