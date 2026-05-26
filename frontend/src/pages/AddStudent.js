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

    const styles = {
        container: {
            padding: '30px 45px',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        pageHeader: {
            marginBottom: '25px'
        },
        pageHeaderTitle: {
            fontSize: '26px',
            fontWeight: '800',
            color: '#0f172a',
            margin: 0
        },
        pageHeaderDesc: {
            color: '#64748b',
            fontSize: '13px',
            marginTop: '6px'
        },
        alert: {
            padding: '14px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        alertSuccess: {
            background: '#ecfdf5',
            color: '#059669',
            border: '1px solid #10b981'
        },
        alertError: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #ef4444'
        },
        panel: {
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '26px',
            marginBottom: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        },
        panelTitle: {
            fontSize: '13px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        panelTitleDot: {
            width: '10px',
            height: '10px',
            background: '#00d2ff',
            borderRadius: '3px'
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '22px'
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
        },
        label: {
            fontSize: '11px',
            color: '#64748b',
            fontWeight: '700',
            textTransform: 'uppercase'
        },
        input: {
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 14px',
            color: '#1e293b',
            fontSize: '14px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            width: '100%',
            transition: '0.3s'
        },
        photoSection: {
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            marginBottom: '22px'
        },
        photoInputWrapper: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '7px'
        },
        photoPreview: {
            width: '140px',
            height: '140px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            overflow: 'hidden',
            flexShrink: 0
        },
        photoPreviewImg: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        btnRow: {
            display: 'flex',
            gap: '12px',
            marginTop: '25px',
            paddingBottom: '40px',
            flexWrap: 'wrap'
        },
        submitBtn: {
            padding: '13px 32px',
            background: '#0f172a',
            color: '#00d2ff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            transition: '0.3s',
            textTransform: 'uppercase',
            flex: 1,
            minWidth: '150px',
            whiteSpace: 'nowrap'
        },
        backBtn: {
            padding: '13px 32px',
            background: '#ffffff',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '13px',
            transition: '0.3s',
            textAlign: 'center',
            flex: 1,
            minWidth: '150px',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.pageHeader}>
                <h1 style={styles.pageHeaderTitle}>New Student Admission</h1>
                <p style={styles.pageHeaderDesc}>Register a new student in the school system</p>
            </div>

            {message && (
                <div style={{...styles.alert, ...(isError ? styles.alertError : styles.alertSuccess)}}>
                    {isError ? '⚠️' : '✅'} {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>

    
                {/* PERSONAL INFORMATION */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>
                        <span style={styles.panelTitleDot}></span> Personal Information
                    </div>
                    <div style={styles.photoSection}>
                        <div style={styles.photoInputWrapper}>
                            <label style={styles.label}>Photo</label>
                            <input
                                type="file" style={styles.input} accept="image/*"
                                onChange={handlePhotoChange}
                                aria-label="Student photo"
                            />
                        </div>
                        <div style={styles.photoPreview}>
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" style={styles.photoPreviewImg} />
                            ) : (
                                <span style={{fontSize: '40px', opacity: '0.3'}}>📸</span>
                            )}
                        </div>
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name *</label>
                            <input type="text" style={styles.input} placeholder="Enter full name"
                                name="name" value={form.name}
                                onChange={handleInputChange} required
                                aria-label="Student full name"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date of Birth</label>
                            <input type="date" style={styles.input}
                                name="date_of_birth" value={form.date_of_birth}
                                onChange={handleInputChange}
                                aria-label="Date of birth"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Gender</label>
                            <select style={styles.input}
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
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Blood Group</label>
                            <select style={styles.input}
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
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Religion</label>
                            <input type="text" style={styles.input} placeholder="e.g., Hindu"
                                name="religion" value={form.religion}
                                onChange={handleInputChange}
                                aria-label="Religion"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Aadhar Number</label>
                            <input type="text" style={styles.input} placeholder="12 digit number"
                                name="aadhar_number" value={form.aadhar_number}
                                onChange={handleInputChange} maxLength="12"
                                aria-label="Aadhar number"
                            />
                        </div>
                    </div>
                </div>


                {/* ACADEMIC INFORMATION */}
                <div style={styles.panel}>
                    <div style={styles.panelTitle}>
                        <span style={styles.panelTitleDot}></span> Academic Information
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Roll Number *</label>
                            <input type="text" style={styles.input} placeholder="e.g., 2026-001"
                                name="roll_number" value={form.roll_number}
                                onChange={handleInputChange} required
                                aria-label="Roll number"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Class *</label>
                            <input type="text" style={styles.input} placeholder="e.g., 10"
                                name="class_name" value={form.class_name}
                                onChange={handleInputChange} required
                                aria-label="Class"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Section</label>
                            <input type="text" style={styles.input} placeholder="e.g., A"
                                name="section" value={form.section}
                                onChange={handleInputChange}
                                aria-label="Section"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admission Number</label>
                            <input type="text" style={styles.input} placeholder="e.g., ADM-552"
                                name="admission_number" value={form.admission_number}
                                onChange={handleInputChange}
                                aria-label="Admission number"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Admission Date</label>
                            <input type="date" style={styles.input}
                                name="admission_date" value={form.admission_date}
                                onChange={handleInputChange}
                                aria-label="Admission date"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Previous School</label>
                            <input type="text" style={styles.input} placeholder="School name"
                                name="previous_school" value={form.previous_school}
                                onChange={handleInputChange}
                                aria-label="Previous school"
                            />
                        </div>
                    </div>
                </div>
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