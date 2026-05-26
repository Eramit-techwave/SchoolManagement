import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landingpage.css';

export default function Landingpage() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        // Navigate to login page with role pre-selected
        navigate('/login', { state: { selectedRole: role } });
    };

    return (
        <div className="landing-page">
            {/* NAVBAR */}
            <header className="navbar">
                <div className="logo">
                    <span>🏫 Apna<span className="highlight">School</span></span>
                </div>
                <nav className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#portal">Portals</a>
                    <a href="#about">About</a>
                </nav>
                <div>
                    <Link to="/login" className="btn-nav">Quick Login</Link>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to the Future of <br />
                        <span className="gradient-text">School Management</span>
                    </h1>
                    <p className="hero-subtitle">
                        A centralized, modern digital hub tailored specifically for students, educators, and administrators. Everything you need is just one click away.
                    </p>
                    <button 
                        className="btn-main"
                        onClick={() => document.getElementById('portal').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Select Your Role ↓
                    </button>
                </div>
            </section>

            {/* ROLE SELECTION SECTION */}
            <section id="portal" className="portal-section">
                <div className="section-header">
                    <h2 className="section-title">🔐 Select Your Access Portal</h2>
                    <p className="section-subtitle">
                        Choose your role to proceed with secure authentication and role-based access
                    </p>
                </div>

                <div className="grid-container">
                    {/* ADMIN PORTAL */}
                    <div 
                        className={`portal-card ${selectedRole === 'admin' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('admin')}
                    >
                        <div className="icon-wrapper admin-icon">🔑</div>
                        <h3 className="card-title">🏛️ Admin Terminal</h3>
                        <p className="card-description">
                            Complete control center for system configurations, admissions, user management, and analytics dashboard.
                        </p>
                        <div className="access-features">
                            <small>✓ Manage Students & Faculty</small>
                            <small>✓ View Activity Analytics</small>
                            <small>✓ Approve Accounts</small>
                            <small>✓ System Configuration</small>
                        </div>
                        <button className="card-btn admin-btn">
                            Access Admin →
                        </button>
                    </div>

                    {/* FACULTY PORTAL */}
                    <div 
                        className={`portal-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('teacher')}
                    >
                        <div className="icon-wrapper faculty-icon">📚</div>
                        <h3 className="card-title">👨‍🏫 Faculty Portal</h3>
                        <p className="card-description">
                            Effortlessly track attendance, manage student records, schedule classes, and monitor academic progress.
                        </p>
                        <div className="access-features">
                            <small>✓ Student Management</small>
                            <small>✓ Mark Attendance</small>
                            <small>✓ View Activity Logs</small>
                            <small>✓ Class Scheduling</small>
                        </div>
                        <button className="card-btn faculty-btn">
                            Enter Faculty Area →
                        </button>
                    </div>

                    {/* STUDENT HUB */}
                    <div 
                        className={`portal-card ${selectedRole === 'student' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('student')}
                    >
                        <div className="icon-wrapper student-icon">🎓</div>
                        <h3 className="card-title">👨‍🎓 Student Portal</h3>
                        <p className="card-description">
                            Your personalized space to view attendance, class schedules, track academic performance, and personal profile.
                        </p>
                        <div className="access-features">
                            <small>✓ View Attendance</small>
                            <small>✓ Class Schedule</small>
                            <small>✓ Personal Timetable</small>
                            <small>✓ Profile Management</small>
                        </div>
                        <button className="card-btn student-btn">
                            Open Student Space →
                        </button>
                    </div>
                </div>

                <div className="role-note">
                    <p>💡 <strong>Note:</strong> Student accounts require admin approval. Faculty accounts must be created by Admin only.</p>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">🌟 Why Choose Apna School?</h2>
                    <p className="section-subtitle">Modern tools designed for educational excellence</p>
                </div>
                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <h4>Lightning Fast</h4>
                        <p>Real-time updates and instant notifications</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🔒</div>
                        <h4>Secure & Monitored</h4>
                        <p>Role-based access, activity tracking, approval workflows</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📱</div>
                        <h4>Mobile Ready</h4>
                        <p>Works seamlessly on all devices</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📊</div>
                        <h4>Smart Analytics</h4>
                        <p>User activity tracking and detailed insights dashboard</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© 2026 Apna School Platform. Built for modern education.</p>
            </footer>
        </div>
    );
}