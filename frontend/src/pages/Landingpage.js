import React from 'react';
import { Link } from 'react-router-dom';
import './Landingpage.css';

export default function Landingpage() {

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
                    <Link to="/login" className="btn-nav">Login</Link>
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
                        Explore Portals ↓
                    </button>
                </div>
            </section>

            {/* PORTAL SECTION */}
            <section id="portal" className="portal-section">
                <div className="section-header">
                    <h2 className="section-title">Select Your Gateway</h2>
                    <p className="section-subtitle">
                        Choose your personalized workspace to manage your day-to-day operations seamlessly.
                    </p>
                </div>

                <div className="grid-container">
                    {/* ADMIN PORTAL */}
                    <div className="portal-card">
                        <div className="icon-wrapper admin-icon">🔑</div>
                        <h3 className="card-title">Admin Terminal</h3>
                        <p className="card-description">
                            Complete control center for system configurations, admissions, data management, and financial auditing.
                        </p>
                        <Link to="/login" className="card-btn admin-btn">
                            Access System →
                        </Link>
                    </div>

                    {/* FACULTY PORTAL */}
                    <div className="portal-card">
                        <div className="icon-wrapper faculty-icon">📚</div>
                        <h3 className="card-title">Faculty Portal</h3>
                        <p className="card-description">
                            Effortlessly track daily attendance, update grading structures, manage class updates, and schedule assignments.
                        </p>
                        <Link to="/login" className="card-btn faculty-btn">
                            Enter Faculty Area →
                        </Link>
                    </div>

                    {/* STUDENT HUB */}
                    <div className="portal-card">
                        <div className="icon-wrapper student-icon">🎓</div>
                        <h3 className="card-title">Student Hub</h3>
                        <p className="card-description">
                            Your personalized space to view exam schedules, track performance analytics, and submit ongoing academic assignments.
                        </p>
                        <Link to="/login" className="card-btn student-btn">
                            Open Student Space →
                        </Link>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Why Choose Apna School?</h2>
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
                        <h4>Secure</h4>
                        <p>Bank-level security for student data</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📱</div>
                        <h4>Mobile Ready</h4>
                        <p>Works seamlessly on all devices</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">🎯</div>
                        <h4>Smart Analytics</h4>
                        <p>Detailed insights and performance tracking</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© 2026 Apna School Platform. Built for  modern education.</p>
            </footer>
        </div>
    );
}