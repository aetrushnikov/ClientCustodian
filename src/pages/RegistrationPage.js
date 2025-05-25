import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { register } from '../services/authService';
import { generateKeys } from '../services/encryption';
import { setItem } from '../utils/storage';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const { publicKey, privateKey } = await generateKeys();
            setItem('privateKey', privateKey);
            await register(username, email, password, publicKey);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#ecf0f1'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                width: '350px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <span style={{ fontSize: '3em', color: '#27ae60' }}>🔒</span>
                    <h1 style={{ fontSize: '2em', color: '#2c3e50', margin: '10px 0' }}>Custodian</h1>
                    <p style={{ fontSize: '1.1em', color: '#7f8c8d' }}>Создайте ваш аккаунт</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                    <label style={{ marginBottom: '15px', color: '#34495e' }}>
                        Имя пользователя:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '5px',
                                border: '1px solid #bdc3c7',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </label>
                    <label style={{ marginBottom: '15px', color: '#34495e' }}>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите электронную почту"
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '5px',
                                border: '1px solid #bdc3c7',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </label>
                    <label style={{ marginBottom: '15px', color: '#34495e' }}>
                        Пароль:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Выберите пароль"
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '5px',
                                border: '1px solid #bdc3c7',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </label>
                    <label style={{ marginBottom: '20px', color: '#34495e' }}>
                        Подтвердите пароль:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Подтвердите пароль"
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '5px',
                                border: '1px solid #bdc3c7',
                                borderRadius: '5px',
                                fontSize: '1em'
                            }}
                        />
                    </label>
                    <Button
                        onClick={handleRegister}
                        style={{
                            padding: '12px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1.1em',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2ecc71'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
                    >
                        Register
                    </Button>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#7f8c8d' }}>
                    <p><span style={{ color: '#27ae60' }}>🔒</span> End-to-end encryption</p>
                    <p>Already have an account? <Link to="/login" style={{ color: '#3498db', textDecoration: 'none' }}>Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default RegistrationPage;