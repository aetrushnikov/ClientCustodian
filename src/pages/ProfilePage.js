// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import ProfileSettings from '../components/ProfileSettings';
import TopNav from '../components/TopNav';
import { getProfile, updateProfile } from '../services/api';

function ProfilePage() {
    const [user, setUser] = useState({ name: '', avatar: null });

    useEffect(() => {
        getProfile()
            .then((response) => setUser(response.data))
            .catch((err) => console.error('Ошибка загрузки профиля:', err));
    }, []);

    const handleUpdate = async (updatedData) => {
        try {
            const response = await updateProfile(updatedData);
            setUser(response.data);
        } catch (err) {
            console.error('Ошибка обновления профиля:', err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f6fa' }}>
            <TopNav />
            <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    width: '400px'
                }}>
                    <h2 style={{ fontSize: '1.8em', color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                        Profile Settings
                    </h2>
                    <ProfileSettings user={user} onUpdate={handleUpdate} />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;