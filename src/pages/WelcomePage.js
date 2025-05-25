// src/pages/WelcomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setServerAddress, getServerAddress } from '../services/serverConfigService';

function WelcomePage() {
    const navigate = useNavigate();
    const [serverUrlInput, setServerUrlInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const currentServerAddress = getServerAddress() || process.env.REACT_APP_DEFAULT_SERVER_ADDRESS || '';
        setServerUrlInput(currentServerAddress);
    }, []);

    const isValidUrl = (string) => {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    const handleNavigation = (path) => {
        if (!serverUrlInput.trim()) {
            setError('Пожалуйста, введите адрес сервера.');
            return;
        }
        if (!isValidUrl(serverUrlInput)) {
            setError('Пожалуйста, введите корректный URL сервера (например, http://localhost:3000 или https://myserver.com)');
            return;
        }
        setError('');
        setServerAddress(serverUrlInput);
        navigate(path);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f4f8'
        }}>
            <div style={{
                display: 'flex',
                width: '80%',
                maxWidth: '1200px',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#e9f7ef',
                    padding: '20px'
                }}>
                    <img src="/main_icon.png" alt="Custodian client Illustration" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5em', color: '#2c3e50', marginBottom: '15px' }}>Custodian</h1>
                    <p style={{ fontSize: '1.2em', color: '#7f8c8d', marginBottom: '20px' }}>Децентрализованный корпоративный мессенджер с повышенным уровнем конфиденциальности</p>
                    
                    <div style={{ width: '80%', marginBottom: '20px' }}>
                        <label htmlFor="serverUrl" style={{ display: 'block', marginBottom: '5px', color: '#333', fontSize: '0.9em', textAlign: 'left' }}>Адрес сервера:</label>
                        <input
                            type="text"
                            id="serverUrl"
                            value={serverUrlInput}
                            onChange={(e) => setServerUrlInput(e.target.value)}
                            placeholder="http://localhost:3000"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                fontSize: '1em'
                            }}
                        />
                        {error && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '5px', textAlign: 'left' }}>{error}</p>}
                    </div>

                    <button onClick={() => handleNavigation('/registration')} style={{
                        padding: '12px 30px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.1em',
                        marginBottom: '10px',
                        transition: 'background-color 0.3s',
                        width: '80%'
                    }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2ecc71'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
                    >
                        Регистрация
                    </button>
                    <button onClick={() => handleNavigation('/login')} style={{
                        padding: '12px 30px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1.1em',
                        transition: 'background-color 0.3s',
                        width: '80%'
                    }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        Логин
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;