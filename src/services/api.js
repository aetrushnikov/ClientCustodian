import axios from 'axios';
import { getServerAddress } from './serverConfigService';

const getBaseApiUrl = () => {
    const serverAddress = getServerAddress();
    if (!serverAddress) {
        console.warn("Адрес сервера не настроен. Используется http://localhost:3000/api по умолчанию.");
        return 'http://localhost:3000/api';
    }
    return `${serverAddress}/api`;
};

const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url && !config.url.startsWith('http://') && !config.url.startsWith('https://')) {
        config.url = `${getBaseApiUrl()}${config.url.startsWith('/') ? config.url : '/' + config.url}`;
    } else if (!config.baseURL) {
    }

    console.log('Sending request:', config);
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

export const loginUser = (email, password) =>
    api.post('/auth/login', { email, password });

export const getProfile = () => api.get('/profile');

export const updateProfile = (data) => api.put('/profile', data);

export const getContacts = () => api.get('/contacts');

export const addContact = (contactData) => api.post('/contacts', contactData);

export const deleteContact = (contactId) => api.delete(`/contacts/${contactId}`);

export const createSpace = (spaceData) => api.post('/spaces/create', spaceData);

export const getSpaces = () => api.get('/spaces');

export const inviteUser = (inviteData) => api.post('/auth/invite', inviteData);

export const getUsersInSpace = (spaceId) => api.get(`/spaces/${spaceId}/users`);

export const getMessages = (spaceId) => api.post('/messages', { spaceId });

export default api;