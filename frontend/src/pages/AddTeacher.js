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
        if (!form.role.trim()) {
            setMessage('Designation is required');
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
        if (form.emergency_phone && !/^[0-9]{10}$/.test(form.emergency_phone.replace(/\D/g, ''))) {
            setMessage('Emergency phone must be 10 digits');
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
            Object.keys(form).forEach(key => {
                if (form[key] !== '') formData.append(key, form[key]);
            });
            if (photo) formData.append('photo', photo);

            await addTeacher(formData);
            setMessage('✅ Staff member registered successfully! Redirecting...');
            setIsError(false);

            setForm({
                name: '', date_of_birth: '', gender: '', blood_group: '', religion: '',
                aadhar_number: '', role: 'Teacher', department: '', subject: '',
                qualification: '', experience: '', joining_date: '', salary: '',
                email: '', phone: '', address: '', emergency_name: '',
                emergency_phone: '', emergency_relation: '', is_active: true
            });
            setPhoto(null);
            setPhotoPreview(null);

            setTimeout(() => {
                window.location.href = '/teachers';
            }, 2000);
        } catch (error) {
            console.error("Error adding teacher:", error);
            setMessage(error.response?.data?.detail || 'Error registering staff member. Please try again!');
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const styles = {
        container: { padding: '30px 45px', maxWidth: '1200px', margin: '0 auto' },
        pageHeader: { marginBottom: '25px' },
        pageHeaderTitle: { fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 },
        pageHeaderDesc: { color: '#64748b', fontSize: '13px', marginTop: '6px' },
        alert: { padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' },
        alertSuccess: { background: '#ecfdf5', color: '#059669', border: '1px solid #10b981' },
        alertError: { background: '#fef2f2', color: '#dc2626', border: '1px solid #ef4444' },
        panel: { background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '26px', marginBottom: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
        panelTitle: { fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' },
        panelTitleDot: { width: '10px', height: '10px', background: '#00d2ff', borderRadius: '3px' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
        label: { fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
        input: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', color: '#1e293b', fontSize: '14px', fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%', transition: '0.3s' },
        photoSection: { display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '22px' },
        photoInputWrapper: { flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' },
        photoPreview: { width: '140px', height: '140px', borderRadius: '12px', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', overflow: 'hidden', flexShrink: 0 },
        photoPreviewImg: { width: '100%', height: '100%', objectFit: 'cover' },
        btnRow: { display: 'flex', gap: '12px', marginTop: '25px', paddingBottom: '40px', flexWrap: 'wrap' },
        submitBtn: { padding: '13px 32px', background: '#0f172a', color: '#00d2ff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase', flex: 1, minWidth: '150px', whiteSpace: 'nowrap' },
        backBtn: { padding: '13px 32px', background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontSize: '13px', transition: '0.3s', textAlign: 'center', flex: 1, minWidth: '150px', whiteSpace: 'nowrap', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <h1 style={styles.pageHeaderTitle}>Staff Registration</h1>
                <p style={styles.pageHeaderDesc}>Onboard new faculty and administrative staff</p>
            </div>

            {message && (
                <div style={{...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess)}}>
                    {isError ? '⚠️' : '✅'} {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* PERSONAL INFORMATION */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> Personal Information</div>
                    <div style={styles.photoSection}>
                        <div style={styles.photoInputWrapper}>
                            <label style={styles.label}>Photo</label>
                            <input type="file" style={styles.input} accept="image/*" onChange={handlePhotoChange} aria-label="Staff photo" />
                        </div>
                        <div style={styles.photoPreview}>
                            {photoPreview ? <img src={photoPreview} alt="Preview" style={styles.photoPreviewImg} /> : <span style={{fontSize: '40px', opacity: '0.3'}}>👤</span>}
                        </div>
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input type="text" style={styles.input} placeholder="Enter full name" name="name" value={form.name} onChange={handleInputChange} required aria-label="Staff full name" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Gender</label>
                            <select style={styles.input} name="gender" value={form.gender} onChange={handleInputChange} aria-label="Gender">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date of Birth</label>
                            <input type="date" style={styles.input} name="date_of_birth" value={form.date_of_birth} onChange={handleInputChange} aria-label="Date of birth" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Blood Group</label>
                            <select style={styles.input} name="blood_group" value={form.blood_group} onChange={handleInputChange} aria-label="Blood group">
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option><option value="A-">A-</option>
                                <option value="B+">B+</option><option value="B-">B-</option>
                                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                <option value="O+">O+</option><option value="O-">O-</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Religion</label>
                            <input type="text" style={styles.input} placeholder="e.g., Hindu" name="religion" value={form.religion} onChange={handleInputChange} aria-label="Religion" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Aadhar Number</label>
                            <input type="text" style={styles.input} placeholder="12 digit number" name="aadhar_number" value={form.aadhar_number} onChange={handleInputChange} maxLength="12" aria-label="Aadhar number" />
                        </div>
                    </div>
                </div>

                {/* PROFESSIONAL INFORMATION */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> Professional Details</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Designation / Role *</label>
                            <select style={styles.input} name="role" value={form.role} onChange={handleInputChange} aria-label="Designation">
                                <option value="Teacher">Teacher</option>
                                <option value="Principal">Principal</option>
                                <option value="Vice Principal">Vice Principal</option>
                                <option value="Librarian">Librarian</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Department</label>
                            <input type="text" style={styles.input} placeholder="e.g., Science" name="department" value={form.department} onChange={handleInputChange} aria-label="Department" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Subject Specialization</label>
                            <input type="text" style={styles.input} placeholder="e.g., Physics" name="subject" value={form.subject} onChange={handleInputChange} aria-label="Subject" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Qualification</label>
                            <input type="text" style={styles.input} placeholder="e.g., B.Sc, M.Sc" name="qualification" value={form.qualification} onChange={handleInputChange} aria-label="Qualification" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Experience (Years)</label>
                            <input type="number" style={styles.input} placeholder="Number of years" name="experience" value={form.experience} onChange={handleInputChange} aria-label="Experience" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Joining Date</label>
                            <input type="date" style={styles.input} name="joining_date" value={form.joining_date} onChange={handleInputChange} aria-label="Joining date" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Monthly Salary</label>
                            <input type="number" style={styles.input} placeholder="Amount in ₹" name="salary" value={form.salary} onChange={handleInputChange} aria-label="Salary" />
                        </div>
                    </div>
                </div>

                {/* CONTACT INFORMATION */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> Contact Information</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input type="tel" style={styles.input} placeholder="10 digit number" name="phone" value={form.phone} onChange={handleInputChange} aria-label="Phone number" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input type="email" style={styles.input} placeholder="example@email.com" name="email" value={form.email} onChange={handleInputChange} aria-label="Email address" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Permanent Address</label>
                            <input type="text" style={styles.input} placeholder="Full address" name="address" value={form.address} onChange={handleInputChange} aria-label="Address" />
                        </div>
                    </div>
                </div>

                {/* EMERGENCY CONTACT */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}><span style={styles.panelTitleDot}></span> Emergency Contact</div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Emergency Contact Person</label>
                            <input type="text" style={styles.input} placeholder="Contact name" name="emergency_name" value={form.emergency_name} onChange={handleInputChange} aria-label="Emergency contact name" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Emergency Phone</label>
                            <input type="tel" style={styles.input} placeholder="10 digit number" name="emergency_phone" value={form.emergency_phone} onChange={handleInputChange} aria-label="Emergency phone" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Relation</label>
                            <input type="text" style={styles.input} placeholder="e.g., Spouse, Parent" name="emergency_relation" value={form.emergency_relation} onChange={handleInputChange} aria-label="Emergency relation" />
                        </div>
                    </div>
                </div>

                <div style={styles.btnRow}>
                    <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? '⏳ Processing...' : '✓ Register Staff'}
                    </button>
                    <a href="/teachers" style={styles.backBtn}>Cancel</a>
                </div>
            </form>
        </div>
    );
}

export default AddTeacher;
