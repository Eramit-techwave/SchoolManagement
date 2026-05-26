import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Layout from './components/Layout';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import AddTeacher from './pages/AddTeacher';
import EyeScanner from './pages/EyeScanner';
import AdminAnalytics from './pages/AdminAnalytics';
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
    if (!token) return <Navigate to="/landing" />;
    return children;
}

// 2. Role Protection: Check karta hai ki User ka role allowed hai ya nahi
function RoleRoute({ children, allowedRoles }) {
    const { user, token } = useAuth();
    
    if (!token) return <Navigate to="/landing" />;
    
    // Agar user ka role allowed list mein nahi hai, toh Dashboard bhej do
    if (!allowedRoles.includes(user?.role)) {
        alert("Access Denied: You don't have permission for this page.");
        return <Navigate to="/" />;
    }
    
    return children;
}

function App() {
    const { token } = useAuth();
    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page - Everyone can see */}
                <Route path="/landing" element={<Landingpage />} />
                
                {/* Login Page */}
                <Route path="/login" element={<Login />} />
                
                {/* All Protected Routes: Wrapped in Layout for consistent sidebar */}
                
                {/* Dashboard sab dekh sakte hain */}
                <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                
                {/* Students: Admin aur Teacher dekh sakte hain */}
                <Route path="/students" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><Layout><Students /></Layout></RoleRoute>
                } />
                
                <Route path="/students/:id" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><Layout><StudentDetail /></Layout></RoleRoute>
                } />

                {/* Add/Edit Student: Sirf Admin */}
                <Route path="/add-student" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><AddStudent /></Layout></RoleRoute>
                } />
                
                <Route path="/edit-student/:id" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><EditStudent /></Layout></RoleRoute>
                } />

                {/* Teachers/Staff: Sirf Admin */}
                <Route path="/teachers" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><Teachers /></Layout></RoleRoute>
                } />
                
                <Route path="/teachers/:id" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><TeacherDetail /></Layout></RoleRoute>
                } />
                
                <Route path="/add-teacher" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><AddTeacher /></Layout></RoleRoute>
                } />
                
                <Route path="/edit-teacher/:id" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><EditTeacher /></Layout></RoleRoute>
                } />

                {/* Attendance: Admin aur Teacher */}
                <Route path="/attendance" element={
                    <RoleRoute allowedRoles={['admin', 'teacher']}><Layout><Attendance /></Layout></RoleRoute>
                } />

                {/* Eye Scanner: Sirf Admin */}
                <Route path="/eye-scanner" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><EyeScanner /></Layout></RoleRoute>
                } />

                {/* User Profile: Sab log dekh sakte hain apna profile */}
                <Route path="/profile" element={
                    <ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>
                } />

                {/* Settings: Sab log access kar sakte hain */}
                <Route path="/settings" element={
                    <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>
                } />

                {/* Admin Analytics: Sirf Admin */}
                <Route path="/admin-analytics" element={
                    <RoleRoute allowedRoles={['admin']}><Layout><AdminAnalytics /></Layout></RoleRoute>
                } />

                {/* Default redirect - agar logged in ho toh dashboard, nahi toh landing page */}
                <Route path="*" element={token ? <Navigate to="/" /> : <Navigate to="/landing" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;