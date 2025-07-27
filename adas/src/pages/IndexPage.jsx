import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import '../styles/MainPage.css';
import {checkAuthOrRedirect} from '../utils/CheckAuth';

function MainPage() {
    const navigate = useNavigate();
    const name = sessionStorage.getItem('userName');
    const surname = sessionStorage.getItem('userSurname');
    const token = sessionStorage.getItem('sessionToken');

    useEffect(() => {
        const check = async () => {
            await checkAuthOrRedirect(navigate);
            // можно продолжать работу только если токен валиден
        };
        check();
    }, [navigate]);
    const handleLogout = async () => {
        try {
            await axios.post(
                'http://localhost/adasNewProject/api/logout.php',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            sessionStorage.clear();
            navigate('/');
        }
    };

    return (
        <div className="main-container">
            <h1>Welcome, {name} {surname}!</h1>
            <p>Tu esi veiksmīgi autorizējies.</p>
            <button className="logout-btn" onClick={handleLogout}>Iziet</button>
            <Link to="/orderList"><button type="button" className="order-btn">Darbinieka panel</button></Link>
            <Link to="/order"><button type="button" className="order-btn">Pasutit maršrutu</button></Link>
        </div>
    );
}

export default MainPage;
