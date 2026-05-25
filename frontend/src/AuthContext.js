import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [token, setToken] = useState(localStorage.getItem('token'));

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role'); // Role bhi remove karo
        window.location.href = '/login';
    }, []);

    // Auto logout 10 min inactivity
    useEffect(() => {
        if (!token) return;
        let timer = setTimeout(logout, 10 * 60 * 1000);
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(logout, 10 * 60 * 1000);
        };
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        window.addEventListener('click', resetTimer);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }, [token, logout]);

    // Token refresh every 8 minutes
    useEffect(() => {
        if (!token) return;
        const refreshToken = async () => {
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/auth/refresh/',
                    { refresh: localStorage.getItem('refresh') }
                );
                const newToken = response.data.access;
                setToken(newToken);
                localStorage.setItem('token', newToken);
            } catch (err) {
                logout();
            }
        };
        const interval = setInterval(refreshToken, 8 * 60 * 1000);
        return () => clearInterval(interval);
    }, [token, logout]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/auth/login/',
                { username, password }
            );
            
            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;
            
            // ✅ STEP 6 Update: Backend se Role fetch karo
            const userRole = response.data.role; 
            
            const userData = { 
                username: response.data.username || username, 
                role: userRole // Role yahan save ho raha hai
            };

            setToken(accessToken);
            setUser(userData);

            localStorage.setItem('token', accessToken);
            localStorage.setItem('refresh', refreshToken);
            localStorage.setItem('role', userRole); // Extra safety ke liye role alag se save karo
            localStorage.setItem('user', JSON.stringify(userData));
            
            return true;
        } catch (err) {
            console.error("Login Context Error:", err);
            return false;
        }
    };

    const forgotPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: 'Password reset email sent!' };
        } catch (err) {
            return { success: false, message: 'Email error!' };
        }
    };

    return (
        // Value mein user (jisne role hai) pass ho raha hai
        <AuthContext.Provider value={{ user, token, login, logout, forgotPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}