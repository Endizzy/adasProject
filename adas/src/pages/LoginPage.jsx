import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router';
import '../styles/Auth.css';
import {redirectIfAuthenticated} from '../utils/CheckAuth';
import ErrorAlert from '../utils/errorAlert.js';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleError = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
    };
// Проверка существования токена и переадресация на страницу.
    useEffect(() => {
        redirectIfAuthenticated(navigate);
    }, [navigate]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost/adasNewProject/api/login.php', formData);
            const { token, id, name, surname, email, origin, destination } = response.data;

            sessionStorage.setItem('sessionToken', token);
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('userName', name);
            sessionStorage.setItem('userSurname', surname);
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('origin', origin || '');
            sessionStorage.setItem('destination', destination || '');
            navigate('/mainPage');
        } catch (error) {
            handleError( 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <ErrorAlert message={errorMessage} />
            <h2>Pieslēgties</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Parole" onChange={handleChange} required />
                <label className="checkbox">
                    <input name="remember" type="checkbox" onChange={handleChange} />
                    Atcerēties mani
                </label>
                <button type="submit">Ieiet</button>
                <Link to="/register">
                    <button type="button">Reģistrēties</button>
                </Link>
            </form>
        </div>
    );
}

export default LoginPage;
