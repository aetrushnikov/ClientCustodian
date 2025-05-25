// src/components/ContactList.js
import React from 'react';
import ContactItem from './ContactItem';

function ContactList({ contacts }) {
    return (
        <ul className="contact-list">
            {contacts.map(contact => (
                <li key={contact.id}>
                    <ContactItem contact={contact} />
                </li>
            ))}
        </ul>
    );
}

export default ContactList;