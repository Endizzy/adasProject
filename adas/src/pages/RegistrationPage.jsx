import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';
import '../styles/Auth.css';
import {redirectIfAuthenticated} from "../utils/CheckAuth";
import ErrorAlert from '../utils/errorAlert';
import LoginPage from "./LoginPage";

function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', surname: '', email: '', password: '' });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleError = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    useEffect(() => {
        redirectIfAuthenticated(navigate);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost/adasNewProject/api/registration.php', formData);
            navigate('/');
        } catch (error) {
            handleError('Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <ErrorAlert message={errorMessage} />
            <h2>Reģistrācija</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" type="text" placeholder="Vārds" onChange={handleChange} required />
                <input name="surname" type="text" placeholder="Uzvārds" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Parole" onChange={handleChange} required />
                <button type="submit">Reģistrēties</button>
                <Link to="/">
                    <button type="button">Autorizacija</button>
                </Link>
            </form>
        </div>
    );
}

export default RegisterPage;
