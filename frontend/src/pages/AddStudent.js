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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage('Photo size must be less than 5MB');
                setIsError(true);
                return;
            }
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            setMessage('Full name is required');
            return false;
        }
        if (!form.roll_number.trim()) {
            setMessage('Roll number is required');
            return false;
        }
        if (!form.class_name.trim()) {
            setMessage('Class is required');
            return false;
        }
        if (form.phone && !/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
            setMessage('Phone number must be 10 digits');
            return false;
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setMessage('Invalid email address');
            return false;
        }
        if (form.aadhar_number && form.aadhar_number.length !== 12) {
            setMessage('Aadhar number must be 12 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!validateForm()) {
            setIsError(true);
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            if (photo) formData.append('photo', photo);

            const response = await addStudent(formData);
            setMessage('✅ Student added successfully! Redirecting...');
            setIsError(false);
            
            // Reset form
            setForm({
                name: '', roll_number: '', class_name: '', section: '',
                date_of_birth: '', gender: '', blood_group: '', religion: '',
                aadhar_number: '', admission_number: '', admission_date: '',
                previous_school: '', email: '', phone: '', address: '',
                father_name: '', father_phone: '', mother_name: '', mother_phone: '',
                parent_email: '', bus_route: '', hostel: false, hostel_room: '',
                is_active: true
            });
            setPhoto(null);
            setPhotoPreview(null);

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/students';
            }, 2000);
        } catch (error) {
            console.error("Error adding student:", error);
            setMessage(error.response?.data?.detail || 'Error adding student. Please try again!');
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tech-shell">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;800&display=swap');

                * { box-sizing: border-box; }

                .tech-shell {
                    display: flex; height: 100vh; background: #FFFFFF; color: #1e293b;
                    font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden;
                }

                /* 🛰️ SIDEBAR NAVIGATION */
                .sidebar {
                    width: 75px; background: #0f172a; border-right: 1px solid #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; padding: 30px 0; gap: 20px;
                    flex-shrink: 0;
                }
                .nav-link {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; font-size: 20px;
                    transition: 0.3s; flex-shrink: 0;
                }
                .nav-link:hover, .nav-link.active {
                    color: #00d2ff; background: rgba(0, 210, 255, 0.1);
                }

                /* 🖥️ MAIN CONTENT AREA */
                .main-content {
                    flex: 1; padding: 30px 45px; overflow-y: auto; background: #fdfdfd;
                    display: flex; flex-direction: column;
                }

                .page-header { margin-bottom: 25px; }
                .page-header h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; }
                .page-header p { color: #64748b; font-size: 13px; margin-top: 6px; }

                /* 🧩 FORM PANELS */
                .form-panel {
                    background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;
                    padding: 26px; margin-bottom: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }
                .panel-title {
                    font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 22px;
                    display: flex; align-items: center; gap: 10px; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .panel-title span { width: 10px; height: 10px; background: #00d2ff; border-radius: 3px; }

                /* ⌨️ INPUT STYLING */
                .form-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 22px;
                }
                .input-group { display: flex; flex-direction: column; gap: 7px; }
                .input-group label {
                    font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;
                }

                .tech-input {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
                    padding: 12px 14px; color: #1e293b; outline: none; transition: 0.3s;
                    font-size: 14px; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .tech-input:focus {
                    border-color: #00d2ff; background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.1);
                }
                .tech-input::placeholder { color: #cbd5e1; }
                .tech-input:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

                /* PHOTO PREVIEW */
                .photo-section {
                    display: flex; gap: 20px; align-items: flex-start; margin-bottom: 22px;
                }
                .photo-input-wrapper {
                    flex: 1; display: flex; flex-direction: column; gap: 7px;
                }
                .photo-preview {
                    width: 140px; height: 140px; border-radius: 12px; border: 2px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    background: #f8fafc; overflow: hidden; flex-shrink: 0;
                }
                .photo-preview img {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .photo-preview span {
                    font-size: 40px; opacity: 0.3;
                }

                /* 🔘 BUTTONS */
                .btn-row {
                    display: flex; gap: 12px; margin-top: 25px; padding-bottom: 40px;
                    flex-wrap: wrap;
                }
                .submit-btn {
                    padding: 13px 32px; background: #0f172a; color: #00d2ff;
                    border: none; border-radius: 10px; font-weight: 800; font-size: 13px;
                    cursor: pointer; transition: 0.3s; text-transform: uppercase;
                    flex: 1; min-width: 150px; white-space: nowrap;
                }
                .submit-btn:hover:not(:disabled) {
                    background: #00d2ff; color: #0f172a; transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0, 210, 255, 0.2);
                }
                .submit-btn:disabled {
                    opacity: 0.6; cursor: not-allowed;
                }

                .back-btn {
                    padding: 13px 32px; background: #ffffff; color: #64748b;
                    border: 1px solid #e2e8f0; border-radius: 10px; font-weight: 700;
                    text-decoration: none; font-size: 13px; transition: 0.3s;
                    text-align: center; flex: 1; min-width: 150px; white-space: nowrap;
                }
                .back-btn:hover {
                    background: #f8fafc; color: #0f172a; border-color: #cbd5e1;
                }

                /* 🚨 ALERT MESSAGES */
                .alert-box {
                    padding: 14px 16px; border-radius: 10px; margin-bottom: 20px;
                    font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 10px;
                }
                .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #ef4444; }

                /* MOBILE RESPONSIVENESS */
                @media (max-width: 1024px) {
                    .main-content { padding: 20px 25px; }
                    .form-grid { gap: 18px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
                    .form-panel { padding: 22px; }
                }

                @media (max-width: 768px) {
                    .sidebar { width: 60px; padding: 20px 0; gap: 15px; }
                    .nav-link { width: 44px; height: 44px; font-size: 18px; }
                    .main-content { padding: 18px 16px; }
                    .page-header { margin-bottom: 18px; }
                    .page-header h1 { font-size: 22px; }
                    .form-panel { padding: 18px; margin-bottom: 16px; }
                    .form-grid { gap: 14px; grid-template-columns: 1fr; }
                    .panel-title { font-size: 12px; margin-bottom: 16px; }
                    .photo-section {
                        flex-direction: column; gap: 14px; align-items: center;
                    }
                    .photo-input-wrapper { width: 100%; }
                    .photo-preview { width: 120px; height: 120px; }
                    .btn-row { gap: 10px; }
                    .submit-btn, .back-btn { min-width: 140px; padding: 12px 24px; font-size: 12px; }
                }

                @media (max-width: 480px) {
                    .sidebar { width: 55px; padding: 15px 0; gap: 12px; }
                    .nav-link { width: 40px; height: 40px; font-size: 16px; }
                    .main-content { padding: 14px 12px; }
                    .page-header h1 { font-size: 18px; }
                    .page-header p { font-size: 12px; }
                    .form-panel { padding: 14px; }
                    .form-grid { gap: 12px; }
                    .panel-title { font-size: 11px; margin-bottom: 14px; }
                    .tech-input { padding: 10px 12px; font-size: 13px; }
                    .photo-preview { width: 100px; height: 100px; }
                    .btn-row { flex-direction: column; gap: 10px; margin-top: 20px; }
                    .submit-btn, .back-btn { width: 100%; min-width: auto; }
                }

                /* Scrollbar */
                .main-content::-webkit-scrollbar {
                    width: 8px;
                }
                .main-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                .main-content::-webkit-scrollbar-thumb {
                    background: #cbd5e1; border-radius: 4px;
                }
                .main-content::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>

            {/* 🛰️ SIDEBAR */}
            <aside className="sidebar">
                <a href="/" className="nav-link" title="Dashboard">🏠</a>
                <a href="/students" className="nav-link active" title="Students">👨‍🎓</a>
                <a href="/eye-scanner" className="nav-link" title="Eye Scanner">👁️</a>
                <a href="/attendance" className="nav-link" title="Attendance">📋</a>
                <a href="/teachers" className="nav-link" title="Teachers">💼</a>
                <div style={{marginTop: 'auto'}}><a href="/settings" className="nav-link" title="Settings">⚙️</a></div>
            </aside>

            {/* 🖥️ MAIN CONTENT AREA */}
            <main className="main-content">
                <div className="page-header">
                    <h1>New Student Admission</h1>
                    <p>Register a new student in the school system</p>
                </div>

                {message && (
                    <div className={`alert-box ${isError ? 'alert-error' : 'alert-success'}`}>
                        {isError ? '⚠️' : '✅'} {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* PERSONAL INFORMATION */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Personal Information</div>
                        <div className="photo-section">
                            <div className="photo-input-wrapper">
                                <label style={{fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'}}>Photo</label>
                                <input
                                    type="file" className="tech-input" accept="image/*"
                                    onChange={handlePhotoChange} style={{padding: '8px'}}
                                    aria-label="Student photo"
                                />
                            </div>
                            {photoPreview && (
                                <div className="photo-preview">
                                    <img src={photoPreview} alt="Preview" />
                                </div>
                            )}
                            {!photoPreview && (
                                <div className="photo-preview">
                                    <span>📸</span>
                                </div>
                            )}
                        </div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Full Name *</label>
                                <input type="text" className="tech-input" placeholder="Enter full name"
                                    name="name" value={form.name}
                                    onChange={handleInputChange} required
                                    aria-label="Student full name"
                                />
                            </div>
                            <div className="input-group">
                                <label>Date of Birth</label>
                                <input type="date" className="tech-input"
                                    name="date_of_birth" value={form.date_of_birth}
                                    onChange={handleInputChange}
                                    aria-label="Date of birth"
                                />
                            </div>
                            <div className="input-group">
                                <label>Gender</label>
                                <select className="tech-input"
                                    name="gender" value={form.gender}
                                    onChange={handleInputChange}
                                    aria-label="Gender"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Blood Group</label>
                                <select className="tech-input"
                                    name="blood_group" value={form.blood_group}
                                    onChange={handleInputChange}
                                    aria-label="Blood group"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option><option value="A-">A-</option>
                                    <option value="B+">B+</option><option value="B-">B-</option>
                                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                    <option value="O+">O+</option><option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Religion</label>
                                <input type="text" className="tech-input" placeholder="e.g., Hindu"
                                    name="religion" value={form.religion}
                                    onChange={handleInputChange}
                                    aria-label="Religion"
                                />
                            </div>
                            <div className="input-group">
                                <label>Aadhar Number</label>
                                <input type="text" className="tech-input" placeholder="12 digit number"
                                    name="aadhar_number" value={form.aadhar_number}
                                    onChange={handleInputChange} maxLength="12"
                                    aria-label="Aadhar number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ACADEMIC INFORMATION */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Academic Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Roll Number *</label>
                                <input type="text" className="tech-input" placeholder="e.g., 2026-001"
                                    name="roll_number" value={form.roll_number}
                                    onChange={handleInputChange} required
                                    aria-label="Roll number"
                                />
                            </div>
                            <div className="input-group">
                                <label>Class *</label>
                                <input type="text" className="tech-input" placeholder="e.g., 10"
                                    name="class_name" value={form.class_name}
                                    onChange={handleInputChange} required
                                    aria-label="Class"
                                />
                            </div>
                            <div className="input-group">
                                <label>Section</label>
                                <input type="text" className="tech-input" placeholder="e.g., A"
                                    name="section" value={form.section}
                                    onChange={handleInputChange}
                                    aria-label="Section"
                                />
                            </div>
                            <div className="input-group">
                                <label>Admission Number</label>
                                <input type="text" className="tech-input" placeholder="e.g., ADM-552"
                                    name="admission_number" value={form.admission_number}
                                    onChange={handleInputChange}
                                    aria-label="Admission number"
                                />
                            </div>
                            <div className="input-group">
                                <label>Admission Date</label>
                                <input type="date" className="tech-input"
                                    name="admission_date" value={form.admission_date}
                                    onChange={handleInputChange}
                                    aria-label="Admission date"
                                />
                            </div>
                            <div className="input-group">
                                <label>Previous School</label>
                                <input type="text" className="tech-input" placeholder="School name"
                                    name="previous_school" value={form.previous_school}
                                    onChange={handleInputChange}
                                    aria-label="Previous school"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CONTACT INFORMATION */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Contact Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input type="tel" className="tech-input" placeholder="10 digit number"
                                    name="phone" value={form.phone}
                                    onChange={handleInputChange}
                                    aria-label="Phone number"
                                />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" className="tech-input" placeholder="example@email.com"
                                    name="email" value={form.email}
                                    onChange={handleInputChange}
                                    aria-label="Email address"
                                />
                            </div>
                            <div className="input-group" style={{gridColumn: 'span 1'}}>
                                <label>Address</label>
                                <input type="text" className="tech-input" placeholder="Full address"
                                    name="address" value={form.address}
                                    onChange={handleInputChange}
                                    aria-label="Address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* GUARDIAN INFORMATION */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Guardian Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Father's Name</label>
                                <input type="text" className="tech-input" placeholder="Father name"
                                    name="father_name" value={form.father_name}
                                    onChange={handleInputChange}
                                    aria-label="Father name"
                                />
                            </div>
                            <div className="input-group">
                                <label>Father's Phone</label>
                                <input type="tel" className="tech-input" placeholder="Phone number"
                                    name="father_phone" value={form.father_phone}
                                    onChange={handleInputChange}
                                    aria-label="Father phone"
                                />
                            </div>
                            <div className="input-group">
                                <label>Mother's Name</label>
                                <input type="text" className="tech-input" placeholder="Mother name"
                                    name="mother_name" value={form.mother_name}
                                    onChange={handleInputChange}
                                    aria-label="Mother name"
                                />
                            </div>
                            <div className="input-group">
                                <label>Mother's Phone</label>
                                <input type="tel" className="tech-input" placeholder="Phone number"
                                    name="mother_phone" value={form.mother_phone}
                                    onChange={handleInputChange}
                                    aria-label="Mother phone"
                                />
                            </div>
                            <div className="input-group">
                                <label>Parent Email</label>
                                <input type="email" className="tech-input" placeholder="Parent email"
                                    name="parent_email" value={form.parent_email}
                                    onChange={handleInputChange}
                                    aria-label="Parent email"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ADDITIONAL INFORMATION */}
                    <div className="form-panel">
                        <div className="panel-title"><span></span> Additional Information</div>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Bus Route</label>
                                <input type="text" className="tech-input" placeholder="Route name"
                                    name="bus_route" value={form.bus_route}
                                    onChange={handleInputChange}
                                    aria-label="Bus route"
                                />
                            </div>
                            <div className="input-group">
                                <label>Hostel</label>
                                <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500}}>
                                    <input type="checkbox" name="hostel" checked={form.hostel}
                                        onChange={handleInputChange} style={{width: '18px', height: '18px', cursor: 'pointer'}}
                                        aria-label="Hostel"
                                    />
                                    <span>Student uses hostel</span>
                                </label>
                            </div>
                            {form.hostel && (
                                <div className="input-group">
                                    <label>Hostel Room</label>
                                    <input type="text" className="tech-input" placeholder="Room number"
                                        name="hostel_room" value={form.hostel_room}
                                        onChange={handleInputChange}
                                        aria-label="Hostel room"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="btn-row">
                        <button
                            type="submit" className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '⏳ Processing...' : '➕ Create Student'}
                        </button>
                        <a href="/students" className="back-btn">Cancel</a>
                    </div>

                </form>
            </main>
        </div>
    );
}

export default AddStudent;