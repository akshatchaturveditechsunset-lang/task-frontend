import { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import { message } from 'antd';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (credentials) => {
        try {
            const { data } = await API.post('/auth/login', credentials);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            message.success('Logged in successfully');
            return true;
        } catch (error) {
            message.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await API.post('/auth/register', userData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            message.success('Registration successful');
            return true;
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await API.post('/auth/logout');
            setUser(null);
            localStorage.removeItem('user');
            message.success('Logged out');
        } catch (error) {
            message.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};