import React, { useState } from 'react';
import { addStudent } from '../api';

function AddStudent() {
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
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            if (photo) formData.append('photo', photo);

            await addStudent(formData);
            setMessage('Student added successfully!');
            setIsError(false);
        } catch (error) {
            setMessage('Error adding student. Please try again!');
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
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px;
                    transition: 0.3s;
                }
                .nav-link:hover, .nav-link.active { 
                    color: #00d2ff; background: rgba(0, 210, 255, 0.1);
                }

                /* 🖥️ MAIN CONTENT AREA */
                .main-content { flex: 1; padding: 30px 50px; overflow-y: auto; background: #fdfdfd; }

                .page-header { margin-bottom: 30px; }
                .page-header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
                .page-header p { color: #64748b; font-size: 14px; margin-top: 5px; }

                /* 🧩 FORM PANELS (Bento Style) */
                .form-panel {
                    background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0;
                    padding: 30px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .panel-title { 
                    font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 25px; 
                    display: flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .panel-title span { width: 12px; height: 12px; background: #00d2ff; border-radius: 3px; }

                /* ⌨️ INPUT STYLING */
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
                .input-group { display: flex; flex-direction: column; gap: 8px; }
                .input-group label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; }
                
                .tech-input {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;
                    padding: 12px 16px; color: #1e293b; outline: none; transition: 0.3s;
                    font-size: 14px; width: 100%; box-sizing: border-box;
                }
                .tech-input:focus { 
                    border-color: #00d2ff; background: #ffffff; 
                    box-shadow: 0 0 0 4px rgba(0, 210, 255, 0.1); 
                }

                /* 🔘 BUTTONS */
                .btn-row { display: flex; gap: 15px; margin-top: 20px; padding-bottom: 50px; }
                .submit-btn {
                    padding: 15px 35px; background: #0f172a; color: #00d2ff;
                    border: none; border-radius: 12px; font-weight: 800; font-size: 14px;
                    cursor: pointer; transition: 0.3s; text-transform: uppercase;
                }
                .submit-btn:hover { background: #00d2ff; color: #0f172a; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 210, 255, 0.2); }
                
                .back-btn {
                    padding: 15px 35px; background: #ffffff; color: #64748b;
                    border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700;
                    text-decoration: none; font-size: 14px; transition: 0.3s;
                }
                .back-btn:hover { background: #f8fafc; color: #0f172a; }

                /* 🚨 ALERT MESSAGES */
                .alert-box {
                    padding: 15px 20px; border-radius: 12px; margin-bottom: 25px;
                    font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 10px;
                }
                .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

                @media (max-width: 768px) { .main-content { padding: 20px; } }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link">🏠</a>
                <a href="/add-student" className="nav-link active">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link">👁️</a>
                <a href="/attendance" className="nav-link">📋</a>
                <a href="/students" className="nav-link">📁</a>
                <div style={{marginTop: 'auto'}}><a href="/settings" className="nav-link">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT AREA */}
            <main className="main-content">
                <div className="page-header">
                    <h1>New Student Admission</h1>
                    <p>Initialize a new identity in the school's central database</p>
                </div>

                {message && (
                    <div className={`alert-box ${isError ? 'alert-error' : 'alert-success'}`}>
                        {isError ? '⚠️' : '✅'} {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    {/* SECTION 1: PERSONAL */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Personal Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name *</label>
                                <input type="text" className="tech-input" placeholder="Enter student name"
                                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Date of Birth</label>
                                <input type="date" className="tech-input"
                                    value={form.date_of_birth} onChange={e => setForm({...form, date_of_birth: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Gender</label>
                                <select className="tech-input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Blood Group</label>
                                <select className="tech-input" value={form.blood_group} onChange={e => setForm({...form, blood_group: e.target.value})}>
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option><option value="B+">B+</option><option value="O+">O+</option><option value="AB+">AB+</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Religion</label>
                                <input type="text" className="tech-input" placeholder="Ex: Hindu/Muslim/Christian"
                                    value={form.religion} onChange={e => setForm({...form, religion: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Aadhar Number</label>
                                <input type="text" className="tech-input" placeholder="12 digit ID" maxLength="12"
                                    value={form.aadhar_number} onChange={e => setForm({...form, aadhar_number: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: ACADEMIC */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> School Records</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Roll Number *</label>
                                <input type="text" className="tech-input" placeholder="Ex: 2026-001"
                                    value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Admission No.</label>
                                <input type="text" className="tech-input" placeholder="Ex: ADM-552"
                                    value={form.admission_number} onChange={e => setForm({...form, admission_number: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Class *</label>
                                <input type="text" className="tech-input" placeholder="Ex: 10"
                                    value={form.class_name} onChange={e => setForm({...form, class_name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Section</label>
                                <input type="text" className="tech-input" placeholder="Ex: A"
                                    value={form.section} onChange={e => setForm({...form, section: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Admission Date</label>
                                <input type="date" className="tech-input"
                                    value={form.admission_date} onChange={e => setForm({...form, admission_date: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Student Photo</label>
                                <input type="file" className="tech-input" accept="image/*"
                                    onChange={e => setPhoto(e.target.files[0])} style={{padding: '8px'}} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CONTACT & GUARDIAN */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Guardian & Address</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Father's Name</label>
                                <input type="text" className="tech-input" placeholder="Enter Father Name"
                                    value={form.father_name} onChange={e => setForm({...form, father_name: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Mother's Name</label>
                                <input type="text" className="tech-input" placeholder="Enter Mother Name"
                                    value={form.mother_name} onChange={e => setForm({...form, mother_name: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Parent Contact</label>
                                <input type="text" className="tech-input" placeholder="Phone number"
                                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label>Email Access</label>
                                <input type="email" className="tech-input" placeholder="Email address"
                                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                            </div>
                            <div className="input-group" style={{gridColumn: 'span 2'}}>
                                <label>Permanent Address</label>
                                <input type="text" className="tech-input" placeholder="Flat, Street, Area, City"
                                    value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="btn-row">
                        <button type="submit" className="submit-btn">Execute Admission</button>
                        <a href="/students" className="back-btn">Cancel & Go Back</a>
                    </div>

                </form>
            </main>
        </div>
    );
}

export default AddStudent;