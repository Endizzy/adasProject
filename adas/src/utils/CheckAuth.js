// src/utils/CheckAuth.js
import axios from 'axios';

// Защита страниц, где должен быть токен (mainPage, orderPage)
export async function checkAuthOrRedirect(navigate) {
    const token = sessionStorage.getItem('sessionToken');
    if (!token) {
        sessionStorage.clear();
        navigate('/');
        return false;
    }

    try {
        const res = await axios.post(
            'http://localhost/adasNewProject/api/get-user.php',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!res.data) {
            sessionStorage.clear();
            navigate('/');
            return false;
        }
        return true;
    } catch {
        sessionStorage.clear();
        navigate('/');
        return false;
    }
}

// Блокирует доступ к login и register, если пользователь уже авторизован
export async function redirectIfAuthenticated(navigate) {
    const token = sessionStorage.getItem('sessionToken');
    if (!token) return;

    try {
        const res = await axios.post(
            'http://localhost/adasNewProject/api/get-user.php',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data) {
            navigate('/mainPage');
        }
    } catch {
        sessionStorage.clear();
    }
}
