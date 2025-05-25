// src/services/authService.js
import api, { loginUser } from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
};

export const register = async (username, email, password, publicKey) => {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
            publicKey
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => !!localStorage.getItem('authToken');