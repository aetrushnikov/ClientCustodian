// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import RegistrationPage from './pages/RegistrationPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import { isAuthenticated } from './services/authService';
import './styles/main.css';

const ProtectedRoute = ({ element }) =>
    isAuthenticated() ? element : <Navigate to="/login" />;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/chat" element={<ProtectedRoute element={<ChatPage />} />} />
                <Route path="/contacts" element={<ProtectedRoute element={<ContactsPage />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            </Routes>
        </Router>
    );
}

export default App;