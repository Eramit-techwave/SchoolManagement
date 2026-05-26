import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Layout.css';

function Layout({ children }) {
    const { user, logout } = useAuth();
    const role = user?.role;

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f5f7fa', overflow: 'hidden' }}>
            {/* SIDEBAR - SINGLE NAVIGATION POINT */}
            <div className="app-sidebar">
                <Link to="/" className="sidebar-icon" title="Dashboard">🏠</Link>
                
                {(role === 'admin' || role === 'teacher') && (
                    <Link to="/students" className="sidebar-icon" title="Students">👨‍🎓</Link>
                )}
                
                {role === 'admin' && (
                    <>
                        <Link to="/eye-scanner" className="sidebar-icon" title="Eye Scanner">👁️</Link>
                        <Link to="/teachers" className="sidebar-icon" title="Faculty">💼</Link>
                        <Link to="/add-student" className="sidebar-icon" title="Add Student">➕</Link>
                        <Link to="/admin-analytics" className="sidebar-icon" title="Analytics">📊</Link>
                    </>
                )}
                
                <Link to="/attendance" className="sidebar-icon" title="Attendance">📋</Link>
                <div className="sidebar-spacer"></div>
                <Link to="/profile" className="sidebar-icon" title="Profile">👤</Link>
                <button onClick={logout} className="logout-btn" title="Logout">🚪</button>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                {children}
            </div>
        </div>
    );
}

export default Layout;
