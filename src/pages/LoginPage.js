// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { login } from '../services/authService';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            const { token, userId, spaces } = response;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userSpaces', JSON.stringify(spaces)); // Сохраняем spaces
            navigate('/chat');
        } catch (err) {
            setError('Ошибка входа. Проверьте данные.');
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
                    <p style={{ fontSize: '1.1em', color: '#7f8c8d' }}>Войдите в ваш аккаунт</p>
                </div>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <label style={{ marginBottom: '20px', color: '#34495e' }}>
                        Пароль:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
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
                        type="submit"
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
                        Войти
                    </Button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#7f8c8d' }}>
                    <p><span style={{ color: '#27ae60' }}>🔒</span> Сквозное шифрование</p>
                    <p>Новый пользователь? <Link to="/registration" style={{ color: '#3498db', textDecoration: 'none' }}>Зарегистрироваться здесь</Link></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;