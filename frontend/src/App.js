import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import AddTeacher from './pages/AddTeacher';
import EyeScanner from './pages/EyeScanner';
import Login from './pages/Login';
import StudentDetail from './pages/StudentDetail';
import TeacherDetail from './pages/TeacherDetail';
import EditStudent from './pages/EditStudent';
import EditTeacher from './pages/EditTeacher';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Landingpage from './pages/Landingpage';
import './styles.css';

// 1. Basic Protection: Sirf Login check karta hai
function ProtectedRoute({ children }) {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" />;
    return children;
}

// 2. Role Protection: Check karta hai ki User ka role allowed hai ya nahi
function RoleRoute({ children, allowedRoles }) {
    const { user, token } = useAuth();
    
    if (!token) return <Navigate to="/login" />;
    
    // Agar user ka role allowed list mein nahi hai, toh Dashboard bhej do
    if (!allowedRoles.includes(user?.role)) {
        alert("Access Denied: You don't have permission for this page.");
        return <Navigate to="/" />;
    }
    
    return children;
}

function Navbar() {
    const { user, logout } = useAuth();
    const role = user?.role;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">🏫 SchoolMS</Link>
            <Link to="/">Dashboard</Link>
            
            {/* Navbar mein bhi role-based links */}
            {(role === 'admin' || role === 'teacher') && <Link to="/students">Students</Link>}
            
            {role === 'admin' && (
                <>
                    <Link to="/add-student">Add Student</Link>
                    <Link to="/teachers">Staff</Link>
                    <Link to="/add-teacher">Add Staff</Link>
                </>
            )}
            
            <Link to="/attendance">Attendance</Link>
            
            {role === 'admin' && <Link to="/eye-scanner">👁️ Scanner</Link>}

            <button onClick={logout} style={{
                background: '#e53935', color: 'white', border: 'none',
                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginLeft: 'auto'
            }}>
                🚪 Logout ({user?.username} - {role})
            </button>
        </nav>
    );
}

function App() {
    const { token } = useAuth();
    return (
        <BrowserRouter>
            {token && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Dashboard sab dekh sakte hain */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                
                {/* Students: Admin aur Teacher dekh sakte hain */}
                <Route path="/students" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><Students /></RoleRoute>
                } />
                
                <Route path="/students/:id" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><StudentDetail /></RoleRoute>
                } />

                {/* Add/Edit Student: Sirf Admin */}
                <Route path="/add-student" element={
                    <RoleRoute allowedRoles={['admin']}><AddStudent /></RoleRoute>
                } />
                
                <Route path="/edit-student/:id" element={
                    <RoleRoute allowedRoles={['admin']}><EditStudent /></RoleRoute>
                } />

                {/* Teachers/Staff: Sirf Admin */}
                <Route path="/teachers" element={
                    <RoleRoute allowedRoles={['admin']}><Teachers /></RoleRoute>
                } />
                
                <Route path="/teachers/:id" element={
                    <RoleRoute allowedRoles={['admin']}><TeacherDetail /></RoleRoute>
                } />
                
                <Route path="/add-teacher" element={
                    <RoleRoute allowedRoles={['admin']}><AddTeacher /></RoleRoute>
                } />
                
                <Route path="/edit-teacher/:id" element={
                    <RoleRoute allowedRoles={['admin']}><EditTeacher /></RoleRoute>
                } />

                {/* Attendance: Admin aur Teacher */}
                <Route path="/attendance" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><Attendance /></RoleRoute>
                } />

                {/* Eye Scanner: Sirf Admin */}
                <Route path="/eye-scanner" element={
                    <RoleRoute allowedRoles={['admin']}><EyeScanner /></RoleRoute>
                } />

                {/* User Profile: Sab log dekh sakte hain apna profile */}
                <Route path="/profile" element={
                    <ProtectedRoute><UserProfile /></ProtectedRoute>
                } />

                {/* Settings: Sab log access kar sakte hain */}
                <Route path="/settings" element={
                    <ProtectedRoute><Settings /></ProtectedRoute>
                } />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;