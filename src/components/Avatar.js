// src/components/Avatar.js
import React from 'react';

function Avatar({ src, alt }) {
    return (
        <div className="profile-placeholder">
            {src ? <img src={src} alt={alt} /> : <span>{alt ? alt[0] : '?'}</span>}
        </div>
    );
}

export default Avatar;