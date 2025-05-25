// src/components/TopNav.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

function TopNav() {
    const navigate = useNavigate();
    return (
        <div className="top-nav">
            <div className="logo">🔒 Custodian</div>
            <Button onClick={() => navigate('/chat')}>Chat</Button>
            <Button onClick={() => navigate('/contacts')}>Contacts</Button>
            <Button onClick={() => navigate('/profile')}>Profile</Button>
        </div>
    );
}

export default TopNav;