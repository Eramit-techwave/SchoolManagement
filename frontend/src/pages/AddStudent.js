import React, { useState } from 'react';
import { addStudent } from '../api';

function AddStudent() {
    const [form, setForm] = useState({
        name: '', roll_number: '', class_name: '', section: '', date_of_birth: '', gender: '', blood_group: '', religion: '', aadhar_number: '', admission_number: '', admission_date: '', previous_school: '', email: '', phone: '', address: '', father_name: '', father_phone: '', mother_name: '', mother_phone: '', parent_email: '', bus_route: '', hostel: false, hostel_room: '', is_active: true
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({...form, [name]: type === 'checkbox' ? checked : value});
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
        if (!form.name.trim()) { setMessage('Full name is required'); return false; }
        if (!form.roll_number.trim()) { setMessage('Roll number is required'); return false; }
        if (!form.class_name.trim()) { setMessage('Class is required'); return false; }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setMessage('Invalid email'); return false; }
        if (form.phone && !/^\d{10}$/.test(form.phone)) { setMessage('Phone must be 10 digits'); return false; }
        if (form.aadhar_number && !/^\d{12}$/.test(form.aadhar_number)) { setMessage('Aadhar must be 12 digits'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        if (photo) formData.append('photo', photo);

        try {
            await addStudent(formData);
            setMessage('Student registered successfully!');
            setIsError(false);
            setTimeout(() => window.location.href = '/students', 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
            setIsError(true);
        }
        setIsSubmitting(false);
    };

    const styles = {
        container: { padding: '30px 45px', maxWidth: '1200px', margin: '0 auto' },
        header: { marginBottom: '25px' },
        title: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        desc: { color: '#64748b', fontSize: '13px', marginTop: '6px' },
        panel: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px', marginBottom: '22px' },
        panelTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' },
        input: { padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', transition: '0.3s' },
        button: { padding: '14px 28px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase', transition: '0.3s' },
        alert: { padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '13px' },
        alertSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        alertError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },
        photoBox: { width: '120px', height: '120px', borderRadius: '12px', background: '#f0f9ff', border: '2px dashed #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', cursor: 'pointer', overflow: 'hidden' },
        photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
        btnRow: { display: 'flex', gap: '12px', marginTop: '30px' },
        cancelBtn: { padding: '14px 28px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', transition: '0.3s', textAlign: 'center' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>New Student Admission</h1>
                <p style={styles.desc}>Register a new student in the school system</p>
            </div>

            {message && <div style={{...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess)}}>{message}</div>}

            <form onSubmit={handleSubmit}>
                {/* PERSONAL INFO */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>📋 Personal Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>📸 Photo</label>
                            <label style={styles.photoBox}>
                                {photoPreview ? <img src={photoPreview} alt="preview" style={styles.photoImg} /> : '📷'}
                                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{display: 'none'}} />
                            </label>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input type="text" name="name" value={form.name} onChange={handleInputChange} style={styles.input} placeholder="Enter full name" required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date of Birth</label>
                            <input type="date" name="date_of_birth" value={form.date_of_birth} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Gender</label>
                            <select name="gender" value={form.gender} onChange={handleInputChange} style={styles.input}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Blood Group</label>
                            <select name="blood_group" value={form.blood_group} onChange={handleInputChange} style={styles.input}>
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Religion</label>
                            <input type="text" name="religion" value={form.religion} onChange={handleInputChange} style={styles.input} placeholder="e.g., Hindu" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Aadhar Number</label>
                            <input type="text" name="aadhar_number" value={form.aadhar_number} onChange={handleInputChange} style={styles.input} placeholder="12 digit number" />
                        </div>
                    </div>
                </div>

                {/* ACADEMIC INFO */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>🎓 Academic Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Roll Number *</label>
                            <input type="text" name="roll_number" value={form.roll_number} onChange={handleInputChange} style={styles.input} placeholder="e.g., 2026-001" required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Class *</label>
                            <input type="text" name="class_name" value={form.class_name} onChange={handleInputChange} style={styles.input} placeholder="e.g., 10" required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Section</label>
                            <input type="text" name="section" value={form.section} onChange={handleInputChange} style={styles.input} placeholder="e.g., A" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admission Number</label>
                            <input type="text" name="admission_number" value={form.admission_number} onChange={handleInputChange} style={styles.input} placeholder="e.g., ADM-552" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admission Date</label>
                            <input type="date" name="admission_date" value={form.admission_date} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Previous School</label>
                            <input type="text" name="previous_school" value={form.previous_school} onChange={handleInputChange} style={styles.input} placeholder="School name" />
                        </div>
                    </div>
                </div>

                {/* CONTACT INFO */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>📞 Contact Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleInputChange} style={styles.input} placeholder="Email address" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone</label>
                            <input type="text" name="phone" value={form.phone} onChange={handleInputChange} style={styles.input} placeholder="10 digit phone" />
                        </div>
                        <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                            <label style={styles.label}>Address</label>
                            <input type="text" name="address" value={form.address} onChange={handleInputChange} style={styles.input} placeholder="Full address" />
                        </div>
                    </div>
                </div>

                {/* PARENT INFO */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>👨‍👩‍👦 Parent Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Father's Name</label>
                            <input type="text" name="father_name" value={form.father_name} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Father's Phone</label>
                            <input type="text" name="father_phone" value={form.father_phone} onChange={handleInputChange} style={styles.input} placeholder="Phone number" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mother's Name</label>
                            <input type="text" name="mother_name" value={form.mother_name} onChange={handleInputChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mother's Phone</label>
                            <input type="text" name="mother_phone" value={form.mother_phone} onChange={handleInputChange} style={styles.input} placeholder="Phone number" />
                        </div>
                        <div style={{...styles.inputGroup, gridColumn: '1 / -1'}}>
                            <label style={styles.label}>Parent Email</label>
                            <input type="email" name="parent_email" value={form.parent_email} onChange={handleInputChange} style={styles.input} />
                        </div>
                    </div>
                </div>

                {/* ADDITIONAL INFO */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>⚙️ Additional Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Bus Route</label>
                            <input type="text" name="bus_route" value={form.bus_route} onChange={handleInputChange} style={styles.input} placeholder="Route name" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                <input type="checkbox" name="hostel" checked={form.hostel} onChange={handleInputChange} /> Student uses hostel
                            </label>
                        </div>
                    </div>
                </div>

                <div style={styles.btnRow}>
                    <button type="submit" style={styles.button} disabled={isSubmitting}>
                        ➕ {isSubmitting ? 'Creating...' : 'Create Student'}
                    </button>
                    <a href="/students" style={styles.cancelBtn}>Cancel</a>
                </div>
            </form>
        </div>
    );
}

export default AddStudent;
