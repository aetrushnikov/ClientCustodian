const SERVER_ADDRESS_KEY = 'dynamic_server_address';

// Используйте REACT_APP_DEFAULT_SERVER_ADDRESS из вашего .env файла
// Например: REACT_APP_DEFAULT_SERVER_ADDRESS=http://localhost:3000
const DEFAULT_SERVER_URL = process.env.REACT_APP_DEFAULT_SERVER_ADDRESS;

export const getServerAddress = () => {
    return localStorage.getItem(SERVER_ADDRESS_KEY) || DEFAULT_SERVER_URL;
};

export const setServerAddress = (address) => {
    if (address && typeof address === 'string') {
        localStorage.setItem(SERVER_ADDRESS_KEY, address.replace(/\/$/, '')); // Удаляем последний слэш, если есть
    } else {
        // Если адрес пустой или не строка, можно удалить ключ или установить значение по умолчанию
        localStorage.removeItem(SERVER_ADDRESS_KEY);
    }
};

// Вы можете добавить эту функцию, если хотите, чтобы другие части приложения могли
// принудительно обновить свое состояние при изменении адреса сервера.
// const subscribers = new Set();
// export const subscribeToServerAddressChange = (callback) => {
//     subscribers.add(callback);
//     return () => subscribers.delete(callback);
// };
// const notifySubscribers = () => {
//     const newAddress = getServerAddress();
//     subscribers.forEach(callback => callback(newAddress));
// };
// export const setServerAddress = (address) => {
//     if (address && typeof address === 'string') {
//         localStorage.setItem(SERVER_ADDRESS_KEY, address.replace(/\/$/, ''));
//     } else {
//         localStorage.removeItem(SERVER_ADDRESS_KEY);
//     }
//     notifySubscribers(); // Уведомить подписчиков
// }; 