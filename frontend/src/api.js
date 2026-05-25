import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

// Students
export const getStudents = () => API.get('/students/');
export const addStudent = (data) => API.post('/students/', data);
export const updateStudent = (id, data) => API.put(`/students/${id}/`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}/`);
export const getStudent = (id) => API.get(`/students/${id}/`);

// Teachers
export const getTeachers = () => API.get('/teachers/');
export const addTeacher = (data) => API.post('/teachers/', data);
export const updateTeacher = (id, data) => API.put(`/teachers/${id}/`, data);
export const deleteTeacher = (id) => API.delete(`/teachers/${id}/`);

// Attendance
export const getAttendance = () => API.get('/attendance/');
export const markAttendance = (data) => API.post('/attendance/', data);

export default API;