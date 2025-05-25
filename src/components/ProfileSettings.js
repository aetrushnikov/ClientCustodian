// src/components/ProfileSettings.js
import React, { useState } from 'react';

function ProfileSettings({ user, onUpdate }) {
    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(user.avatar);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ name, avatar });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
            </label>
            <label>
                Avatar URL:
                <input
                    type="text"
                    value={avatar || ''}
                    onChange={(e) => setAvatar(e.target.value)}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
            </label>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#27ae60', color: 'white' }}>
                Save
            </button>
        </form>
    );
}

export default ProfileSettings;