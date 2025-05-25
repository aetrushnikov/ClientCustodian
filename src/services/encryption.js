// src/services/encryption.js
import { encrypt, decrypt } from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

// Helper function to convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
};

// Helper function to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

// Generate RSA key pair
export const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: 'SHA-256',
        },
        true, // Extractable
        ['encrypt', 'decrypt']
    );

    // Export public key to base64
    const publicKeyExported = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const publicKeyBase64 = arrayBufferToBase64(publicKeyExported);

    // Export private key to base64
    const privateKeyExported = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const privateKeyBase64 = arrayBufferToBase64(privateKeyExported);

    return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
};

// Encrypt message with AES
export const encryptMessage = (message, aesKey) => {
    return encrypt(message, aesKey).toString();
};

// Decrypt message with AES
export const decryptMessage = (encryptedMessage, aesKey) => {
    return decrypt(encryptedMessage, aesKey).toString(Utf8);
};

// Encrypt AES key with RSA public key
export const encryptAESKey = async (aesKey, publicKeyBase64) => {
    const publicKeyArrayBuffer = base64ToArrayBuffer(publicKeyBase64);
    const publicKey = await window.crypto.subtle.importKey(
        'spki',
        publicKeyArrayBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
    );

    const encodedAESKey = new TextEncoder().encode(aesKey);
    const encryptedAESKey = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        encodedAESKey
    );

    return arrayBufferToBase64(encryptedAESKey);
};

// Decrypt AES key with RSA private key
export const decryptAESKey = async (encryptedAESKeyBase64, privateKeyBase64) => {
    const privateKeyArrayBuffer = base64ToArrayBuffer(privateKeyBase64);
    const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyArrayBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
    );

    const encryptedAESKey = base64ToArrayBuffer(encryptedAESKeyBase64);
    const decryptedAESKey = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        encryptedAESKey
    );

    return new TextDecoder().decode(decryptedAESKey);
};