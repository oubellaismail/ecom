import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`notification ${type}`}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '15px 25px',
                borderRadius: '8px',
                background: type === 'success'
                    ? 'linear-gradient(90deg, #4CAF50, #45a049)'
                    : 'linear-gradient(90deg, #ff4d4d, #ff8080)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                animation: 'slideIn 0.3s ease-out',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <i className={`bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
            <span>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    marginLeft: '10px'
                }}
            >
                <i className="bi bi-x"></i>
            </button>
        </div>
    );
};

export default Notification; 