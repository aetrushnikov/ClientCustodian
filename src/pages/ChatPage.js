import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import api from '../services/api';
import webSocketService from '../services/websocket';
import { encryptMessage, decryptMessage } from '../services/encryption';
import { getServerAddress } from '../services/serverConfigService';
import '../styles/main.css';

function UserList({ users, onSelectUser }) {
    return (
        <ul className="contact-list">
            {users.map(user => (
                <li key={user.userId} className="contact-item" onClick={() => onSelectUser(user)}>
                    <Avatar alt={user.username} />
                    <span>{user.username}</span>
                </li>
            ))}
        </ul>
    );
}

function SpaceList({ spaces, onSelectSpace, onCreateSpace }) {
    return (
        <>
            <Button onClick={onCreateSpace} className="create-group-button">Создать пространство</Button>
            <ul className="contact-list">
                {spaces.map(space => (
                    <li key={space.id} className="contact-item" onClick={() => onSelectSpace(space)}>
                        <div style={{ fontWeight: 'bold' }}>{space.name}</div>
                        {space.description && <div style={{ fontSize: '0.9em', color: '#555', marginTop: '4px' }}>{space.description}</div>}
                    </li>
                ))}
            </ul>
        </>
    );
}

function MessageList({ messages, users }) {
    const getUserById = (userId) => {
        if (!users || users.length === 0) return userId;
        const user = users.find(u => u.userId === userId);
        return user ? user.username : userId;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Unknown time';
        try {
            return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.error("Error formatting timestamp:", e);
            return 'Invalid time';
        }
    };

    return (
        <div className="messages">
            {messages.map(msg => (
                <div key={msg.messageId} className="message">
                    <strong>{getUserById(msg.senderId)}</strong> ({formatTimestamp(msg.timestamp)}): {msg.content}
                </div>
            ))}
        </div>
    );
}

function MessageInput({ value, onChange, onSend }) {
    return (
        <div className="message-input">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message..."
            />
            <Button onClick={onSend}>Send</Button>
        </div>
    );
}

function ChatPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const aesKey = 'your-aes-key'; // TODO: Замените на безопасное управление ключами

    // Состояния для модального окна создания пространства
    const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState('');
    const [newSpaceDescription, setNewSpaceDescription] = useState('');

    // Состояния для модального окна подтверждения типа токена приглашения
    const [showInviteTokenModal, setShowInviteTokenModal] = useState(false);
    const [inviteSpaceId, setInviteSpaceId] = useState(null); // Для хранения spaceId при открытии модалки
    const [isSingleUseInvite, setIsSingleUseInvite] = useState(true); // По умолчанию одноразовый

    // Состояния для модального окна присоединения к пространству
    const [showJoinSpaceModal, setShowJoinSpaceModal] = useState(false);
    const [joinSpaceTokenValue, setJoinSpaceTokenValue] = useState('');

    const selectedSpaceObject = selectedSpace ? spaces.find(s => s.id === selectedSpace) : null;
    const spaceDisplayName = selectedSpaceObject ? selectedSpaceObject.name : selectedSpace;

    const fetchUserAndSpaceData = () => {
        api.get('/auth/')
            .then(response => {
                setUsers(response.data.users);
                const serverProvidedSpaces = response.data.spaces || [];
                // Предполагаем, что сервер возвращает массив объектов типа: { spaceId, name, description }
                const processedSpaces = serverProvidedSpaces.map(space => ({
                    id: space.spaceId, // Используем space.spaceId от сервера
                    name: space.name || space.spaceId, // Используем spaceId, если имя отсутствует
                    description: space.description || ''
                }));
                setSpaces(processedSpaces);
            })
            .catch(error => console.error('Error fetching users and spaces:', error));
    };

    useEffect(() => {
        fetchUserAndSpaceData();

        const serverAddress = getServerAddress();
        if (serverAddress) {
            const wsProtocol = serverAddress.startsWith('https') ? 'wss://' : 'ws://';
            const baseAddress = serverAddress.replace(/^https?:\/\//, '').replace(/\/api$/, '');
            const wsUrl = `${wsProtocol}${baseAddress}`;
            console.log(`Attempting to connect WebSocket to: ${wsUrl}`);
            webSocketService.connect(wsUrl);
        } else {
            console.error("Server address is not configured for WebSocket!");
        }

        webSocketService.onMessage((message) => {
            if (message.type === 'personal' &&
                (message.receiverId === localStorage.getItem('userId') ||
                    message.senderId === localStorage.getItem('userId')) &&
                selectedUser && message.receiverId === selectedUser.userId) {
                const decrypted = decryptMessage(message.encryptedContentBase64, aesKey);
                setMessages(prev => [...prev, {
                    messageId: message.messageId,
                    senderId: message.senderId,
                    content: decrypted,
                    timestamp: message.timestamp // Добавляем timestamp
                }]);
            } else if (message.type === 'space' && selectedSpace === message.spaceId) {
                const decrypted = decryptMessage(message.encryptedContentBase64, aesKey);
                setMessages(prev => [...prev, {
                    messageId: message.messageId,
                    senderId: message.senderId,
                    content: decrypted,
                    timestamp: message.timestamp // Добавляем timestamp
                }]);
            }
        });

        return () => {
            console.log("Disconnecting WebSocket");
            webSocketService.disconnect();
        };
    }, [selectedUser, selectedSpace]);

    useEffect(() => {
        if (selectedUser) {
            api.get(`/messages/personal?userId=${selectedUser.userId}`)
                .then(response => {
                    const decryptedMessages = response.data
                        .map(msg => ({
                            ...msg,
                            content: decryptMessage(msg.encryptedContentBase64, aesKey)
                        }))
                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Сортировка по timestamp
                    setMessages(decryptedMessages);
                })
                .catch(error => console.error('Error fetching personal messages:', error));
        } else if (selectedSpace) {
            api.get(`/messages/space?spaceId=${selectedSpace}`)
                .then(response => {
                    const decryptedMessages = response.data
                        .map(msg => ({
                            ...msg,
                            content: decryptMessage(msg.encryptedContentBase64, aesKey)
                        }))
                        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Сортировка по timestamp
                    setMessages(decryptedMessages);
                })
                .catch(error => console.error('Error fetching space messages:', error));
        }
    }, [selectedUser, selectedSpace]);

    const handleCreateSpace = async () => {
        setShowCreateSpaceModal(true);
    };

    const submitCreateSpace = async () => {
        if (!newSpaceName) {
            alert("Название пространства не может быть пустым.");
            return;
        }
        try {
            const response = await api.post('/spaces/create', { name: newSpaceName, description: newSpaceDescription });
            if (response.data && response.data.spaceId) {
                const newSpaceData = {
                    id: response.data.spaceId,
                    name: response.data.name,
                    description: response.data.description
                };
                setSpaces(prevSpaces => {
                    const index = prevSpaces.findIndex(s => s.id === newSpaceData.id);
                    if (index !== -1) {
                        const updatedSpaces = [...prevSpaces];
                        updatedSpaces[index] = newSpaceData;
                        return updatedSpaces;
                    } else {
                        return [...prevSpaces, newSpaceData];
                    }
                });
                alert(`Пространство "${response.data.name}" успешно создано!`);
                setShowCreateSpaceModal(false);
                setNewSpaceName('');
                setNewSpaceDescription('');
            }
        } catch (error) {
            console.error('Error creating space:', error);
            alert('Не удалось создать пространство. ' + (error.response?.data?.error || error.message));
        }
    };

    const handleCreateInviteToken = async (spaceId) => {
        if (!spaceId) {
            alert("Сначала выберите пространство.");
            return;
        }
        setInviteSpaceId(spaceId);
        setShowInviteTokenModal(true);
    };

    const submitCreateInviteToken = async () => {
        if (!inviteSpaceId) return;

        try {
            const response = await api.post('/auth/invite', { spaceId: inviteSpaceId, isSingleUse: isSingleUseInvite });
            if (response.data && response.data.inviteLink) {
                // Вместо prompt, мы можем просто скопировать в буфер обмена или показать в текстовом поле
                // Для простоты пока оставим alert, но его тоже хорошо бы заменить на кастомное уведомление
                alert("Ссылка-приглашение создана (будет показана в prompt для копирования):");
                prompt("Ссылка-приглашение (скопируйте ее):", response.data.inviteLink);
            }
        } catch (error) {
            console.error('Error creating invite token:', error);
            alert('Не удалось создать токен приглашения. ' + (error.response?.data?.error || error.message));
        }
        setShowInviteTokenModal(false);
        setInviteSpaceId(null);
    };

    const handleJoinSpaceByToken = async () => {
        setShowJoinSpaceModal(true);
    };

    const submitJoinSpaceByToken = async () => {
        if (!joinSpaceTokenValue) {
            alert("Токен приглашения не может быть пустым.");
            return;
        }
        try {
            const response = await api.post('/auth/join-space', { token: joinSpaceTokenValue });
            if (response.data && response.data.message) {
                alert(response.data.message);
                fetchUserAndSpaceData();
                setShowJoinSpaceModal(false);
                setJoinSpaceTokenValue('');
            }
        } catch (error) {
            console.error('Error joining space by token:', error);
            alert('Не удалось присоединиться к пространству. ' + (error.response?.data?.error || error.message));
        }
    };

    const handleSendMessage = () => {
        if (newMessage) {
            const encrypted = encryptMessage(newMessage, aesKey);
            if (selectedUser) {
                api.post('/messages/personal', {
                    receiverId: selectedUser.userId,
                    encryptedContent: encrypted,
                    iv: 'your-iv', // Replace with actual IV
                    encryptedAesKey: 'your-encrypted-aes-key' // Replace with actual encrypted AES key
                })
                    .then(response => {
                        setMessages(prev => [...prev, {
                            messageId: response.data.messageId,
                            senderId: response.data.senderId,
                            content: newMessage,
                            timestamp: new Date().toISOString() // Добавляем текущую дату
                        }]);
                        setNewMessage('');
                    })
                    .catch(error => console.error('Error sending personal message:', error));
            } else if (selectedSpace) {
                api.post('/messages/space', {
                    spaceId: selectedSpace,
                    encryptedContent: encrypted,
                    iv: 'your-iv', // Replace with actual IV
                    encryptedAesKey: 'your-encrypted-aes-key' // Replace with actual encrypted AES key
                })
                    .then(response => {
                        setMessages(prev => [...prev, {
                            messageId: response.data.messageId,
                            senderId: response.data.senderId,
                            content: newMessage,
                            timestamp: new Date().toISOString() // Добавляем текущую дату
                        }]);
                        setNewMessage('');
                    })
                    .catch(error => console.error('Error sending space message:', error));
            }
        }
    };

    return (
        <div className="chat-container">
            <TopNav />
            <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                <div className="contacts-pane">
                    <h2>Users</h2>
                    <UserList users={users} onSelectUser={(user) => { setSelectedUser(user); setSelectedSpace(null); }} />
                    <h2>Spaces</h2>
                    <SpaceList
                        spaces={spaces}
                        onSelectSpace={(spaceObj) => {
                            setSelectedSpace(spaceObj.id);
                            setSelectedUser(null);
                        }}
                        onCreateSpace={handleCreateSpace}
                    />
                    <Button onClick={handleJoinSpaceByToken} className="join-space-button" style={{ marginTop: '10px' }}> 
                        Войти в пространство по токену
                    </Button>
                </div>
                <div className="chat-pane">
                    {selectedUser || selectedSpace ? (
                        <>
                            <h2>
                                {selectedUser ? `Chat with ${selectedUser.username}` : `Space: ${spaceDisplayName}`}
                                {selectedSpace && (
                                    <Button onClick={() => handleCreateInviteToken(selectedSpace)} style={{ marginLeft: '10px', fontSize: '0.8em' }}>
                                        Пригласить в пространство
                                    </Button>
                                )}
                            </h2>
                            <MessageList messages={messages} users={users} />
                            <MessageInput
                                value={newMessage}
                                onChange={setNewMessage}
                                onSend={handleSendMessage}
                            />
                        </>
                    ) : (
                        <p>Select a user or space to start chatting</p>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showCreateSpaceModal}
                onClose={() => {
                    setShowCreateSpaceModal(false);
                    setNewSpaceName('');
                    setNewSpaceDescription('');
                }}
                title="Создать новое пространство"
                onSubmit={submitCreateSpace}
                submitText="Создать"
            >
                <label htmlFor="spaceName">Название пространства:</label>
                <input
                    type="text"
                    id="spaceName"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '15px' }}
                />
                <label htmlFor="spaceDescription">Описание (опционально):</label>
                <input
                    type="text"
                    id="spaceDescription"
                    value={newSpaceDescription}
                    onChange={(e) => setNewSpaceDescription(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
            </Modal>

            <Modal
                isOpen={showInviteTokenModal}
                onClose={() => {
                    setShowInviteTokenModal(false);
                    setInviteSpaceId(null);
                }}
                title="Создать токен приглашения"
                onSubmit={submitCreateInviteToken}
                submitText="Создать токен"
            >
                <p>Сделать токен одноразовым?</p>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="tokenType"
                            value="single"
                            checked={isSingleUseInvite}
                            onChange={() => setIsSingleUseInvite(true)}
                        />
                        Да, одноразовый
                    </label>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        <input
                            type="radio"
                            name="tokenType"
                            value="multi"
                            checked={!isSingleUseInvite}
                            onChange={() => setIsSingleUseInvite(false)}
                        />
                        Нет, многоразовый
                    </label>
                </div>
            </Modal>

            <Modal
                isOpen={showJoinSpaceModal}
                onClose={() => {
                    setShowJoinSpaceModal(false);
                    setJoinSpaceTokenValue('');
                }}
                title="Войти в пространство по токену"
                onSubmit={submitJoinSpaceByToken}
                submitText="Войти"
            >
                <label htmlFor="joinToken">Токен приглашения:</label>
                <input
                    type="text"
                    id="joinToken"
                    value={joinSpaceTokenValue}
                    onChange={(e) => setJoinSpaceTokenValue(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
            </Modal>
        </div>
    );
}

export default ChatPage;