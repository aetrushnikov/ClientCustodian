// src/components/ContactItem.js
import React from 'react';
import Avatar from './Avatar';

function ContactItem({ contact }) {
    return (
        <div className="contact-item">
            <Avatar src={contact.avatar} alt={contact.name} />
            <span>{contact.name}</span>
        </div>
    );
}

export default ContactItem;