import React, {useEffect, useState} from 'react';
import '../styles/OrderListPage.css';
import axios from "axios";
import {useNavigate} from "react-router";

const OrderListPage = () => {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(null);
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        id: '',
    });

    useEffect(() => {
        const checkAdmin = async () => {
            const token = sessionStorage.getItem('sessionToken');
            if (!token) {
                navigate('/');
                return;
            }
            setUserData({
                name: sessionStorage.getItem('userName') || '',
                surname: sessionStorage.getItem('userSurname') || '',
                email: sessionStorage.getItem('userEmail') || '',
                id: sessionStorage.getItem('userId')
            });

            try {
                const res = await axios.get('http://localhost/adasNewProject/api/check-admin.php', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setAuthorized(true);
                } else {
                    navigate('/');
                }
            } catch (err) {
                navigate('/');
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost/adasNewProject/api/get-orders.php');
                setOrders(res.data);
            } catch (err) {
                console.error('Kļūda ielādējot pasūtījumus');
            }
        };

        fetchOrders(); // начальная загрузка
        const interval = setInterval(fetchOrders, 10000); // автообновление

        return () => clearInterval(interval); // очистка
    }, []);

    if (authorized === null) {
        // Проверка ещё идёт
        return <div>Notiek pārbaude...</div>; // Или спиннер
    }

    if (!authorized) {
        return null; // Защита от лишнего рендера, но navigate всё равно сработает
    }

  return (
    <div className="background">
      <div className="container">
        <div className="order-container">
            <div className="order-header">
                <p className="page-title">Lietotāja pasutijuma informacija</p>
                <p className="user-id">darbinieka_ID: {userData.id}</p>
            </div>
            <div className="order-cards">
                {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <div className="order__card-header">
                            <h1 className="card__title">Pasūtījums Nr: {order.id}</h1>
                        </div>
                        <div className="order__card-content">
                            <span className="CustumeID">Lietotāja_ID: {order.user_id}</span>
                            <span className="CustomerEmail">Email: {order.email}</span>
                            <span className="CustomerSurname">Uzvārds: {order.surname}</span>
                            <span className="StartPoint">Sākumpunkts: {order.origin}</span>
                            <span className="EndPoint">Galapunkts: {order.destination}</span>
                        </div>
                        <button className="TakeOrder">Apstrādāt</button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
