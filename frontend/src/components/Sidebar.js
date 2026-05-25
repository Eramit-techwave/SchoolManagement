import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/', icon: '🏠', label: 'Dashboard' },
        { path: '/students', icon: '👨‍🎓', label: 'Students' },
        { path: '/teachers', icon: '💼', label: 'Staff' },
        { path: '/attendance', icon: '📋', label: 'Attendance' },
        { path: '/eye-scanner', icon: '👁️', label: 'Eye Scanner' },
    ];

    return (
        <aside className="side-nav">
            <style>{`
                .side-nav {
                    width: 75px; background: #0f172a; height: 100vh;
                    display: flex; flex-direction: column; align-items: center;
                    padding: 25px 0; position: fixed; left: 0; top: 0; z-index: 100;
                    border-right: 1px solid rgba(255,255,255,0.05);
                }
                .nav-item {
                    width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
                    border-radius: 14px; color: #94a3b8; text-decoration: none; 
                    font-size: 22px; transition: 0.3s; margin-bottom: 15px;
                }
                .nav-item:hover, .nav-item.active { 
                    color: #00d2ff; background: rgba(0, 210, 255, 0.1); transform: translateX(3px);
                }
                .logout-btn {
                    margin-top: auto; background: rgba(248, 113, 113, 0.1); border: none;
                    width: 48px; height: 48px; border-radius: 14px;
                    font-size: 20px; cursor: pointer; color: #f87171; transition: 0.3s;
                }
                .logout-btn:hover { background: #ef4444; color: #fff; transform: scale(1.1); }
                
                .user-initials {
                    width: 35px; height: 35px; background: #1e293b; color: #00d2ff;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 800; margin-bottom: 25px; border: 1px solid #334155;
                }
            `}</style>
            
            <div className="user-initials" title={user?.username}>
                {user?.username?.substring(0,2).toUpperCase() || 'AD'}
            </div>
            
            {menuItems.map((item) => (
                <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    title={item.label}
                >
                    {item.icon}
                </Link>
            ))}

            <button onClick={logout} className="logout-btn" title="Sign Out System">🚪</button>
        </aside>
    );
}

export default Sidebar;