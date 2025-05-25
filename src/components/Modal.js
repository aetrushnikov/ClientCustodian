// src/components/Modal.js
import React from 'react';
import '../styles/main.css'; // Убедимся, что стили подключены

function Modal({ isOpen, onClose, title, children, onSubmit, submitText = "ОК" }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{title}</h2>
                {children}
                {onSubmit && (
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <button className="custom-button" onClick={onSubmit}>
                            {submitText}
                        </button>
                        <button className="custom-button" onClick={onClose} style={{ marginLeft: '10px', backgroundColor: '#ccc' }}>
                            Отмена
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;