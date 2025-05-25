// src/pages/ContactsPage.js
import React, { useState, useEffect } from 'react';
import ContactList from '../components/ContactList';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TopNav from '../components/TopNav';
import { getContacts, addContact } from '../services/api';

function ContactsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState('');

    useEffect(() => {
        getContacts()
            .then((response) => setContacts(response.data))
            .catch((err) => console.error('Ошибка загрузки контактов:', err));
    }, []);

    const handleAddContact = async () => {
        try {
            const response = await addContact({ name: newContact });
            setContacts((prev) => [...prev, response.data]);
            setIsModalOpen(false);
            setNewContact('');
        } catch (err) {
            console.error('Ошибка добавления контакта:', err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f6fa' }}>
            <TopNav />
            <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '1.8em', color: '#2c3e50', marginBottom: '20px' }}>Contacts</h2>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        marginBottom: '20px'
                    }}
                >
                    Add Contact
                </Button>
                <ContactList contacts={contacts} />
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h3 style={{ fontSize: '1.5em', color: '#2c3e50', marginBottom: '20px' }}>Add New Contact</h3>
                    <input
                        type="text"
                        value={newContact}
                        onChange={(e) => setNewContact(e.target.value)}
                        placeholder="Enter contact name"
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '20px',
                            border: '1px solid #bdc3c7',
                            borderRadius: '5px',
                            fontSize: '1em'
                        }}
                    />
                    <Button
                        onClick={handleAddContact}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1em'
                        }}
                    >
                        Save
                    </Button>
                </Modal>
            </div>
        </div>
    );
}

export default ContactsPage;