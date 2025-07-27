import React, { useEffect, useRef, useState } from 'react';
import '../styles/Order.css';
import {checkAuthOrRedirect} from "../utils/CheckAuth";
import {useNavigate} from "react-router";
import ErrorAlert from '../utils/errorAlert.js';
import axios from "axios";

const OrderPage = () => {
    const mapRef = useRef(null);
    const directionsRendererRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        surname: '',
        email: '',
        id: '',
        origin: '',
        destination: '',
    });

    const handleError = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(''), 5000);
    };
    const handleSubmitOrder = async () => {
        try {
            const payload = {
                userId: userData.id,
                email: userData.email,
                surname: userData.surname,
                origin,
                destination,
            };

            const response = await axios.post('http://localhost/adasNewProject/api/create-order.php', payload);

            if (response.data && response.data.success) {
                handleError("Pasūtījums veiksmīgi nosūtīts!");
            } else {
                handleError("Nezināma kļūda!");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                // Точная ошибка с сервера
                handleError(err.response.data.error);
            } else {
                handleError("Kļūda sūtot pasūtījumu!");
            }
        }
    };



    useEffect(() => {
        const initialize = async () => {
            const isValid = await checkAuthOrRedirect(navigate);
            if (!isValid) return;

            setUserData({
                name: sessionStorage.getItem('userName') || '',
                surname: sessionStorage.getItem('userSurname') || '',
                email: sessionStorage.getItem('userEmail') || '',
                id: sessionStorage.getItem('userId'),
                origin: sessionStorage.getItem('origin'),
                destination: sessionStorage.getItem('destination')
            });

            const initMap = () => {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 56.95, lng: 24.1 },
                    zoom: 7,
                    streetViewControl: false,
                });

                mapInstanceRef.current = map;
                directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
                directionsRendererRef.current.setMap(map);

                const originInput = document.getElementById('origin');
                const destinationInput = document.getElementById('destination');
                new window.google.maps.places.Autocomplete(originInput);
                new window.google.maps.places.Autocomplete(destinationInput);
            };

            if (!window.google || !window.google.maps) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDOW2pTTr0pQVMSrHnCBnxm1daoL09oOlQ&libraries=places`;
                script.async = true;
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                initMap();
            }
        };

        initialize();
    }, [navigate]);


    const handleRouteUpdate = () => {
        if (!origin || !destination || !window.google || !mapInstanceRef.current) return;

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    directionsRendererRef.current.setDirections(result);
                } else {
                    handleError('Neizdevās atrast maršrutu: ' + status);
                }
            }
        );
    };

    return (
        <div className="background">
            <ErrorAlert message={errorMessage} />
            <div className="order-container">
                <div className="order-header">
                    <h1>Pasutījums</h1>
                    <span className="user-id">Lietotaja_ID: {userData.id}</span>
                </div>

                <div className="form-section">
                    <div className="left-column">
                        <label>Vārds</label>
                        <input type="text" defaultValue={userData.name} />

                        <label>Uzvārds</label>
                        <input type="text" defaultValue={userData.surname} />

                        <label>Email</label>
                        <input type="email" defaultValue={userData.email} />
                    </div>

                    <div className="right-column">
                        <label>Sākumpunkts</label>
                        <input
                            type="text"
                            id="origin"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder={userData.origin}
                        />

                        <label>Galapunkts</label>
                        <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder={userData.destination}
                        />
                    </div>
                </div>

                <button className="update-btn" onClick={handleRouteUpdate}>
                Atjaunināt
                </button>

                <div className="map-container">
                    <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
                </div>

                <button className="submit-btn" onClick={handleSubmitOrder}>Sūtīt</button>
            </div>
        </div>
    );
};

export default OrderPage;
