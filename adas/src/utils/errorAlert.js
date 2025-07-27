// src/utils/ErrorAlert.js
import React from 'react';
import '../styles/ErrorAlert.css';

const ErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div className="error-alert">
            {message}
        </div>
    );
};

export default ErrorAlert;
