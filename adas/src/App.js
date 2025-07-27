import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import IndexPage from "./pages/IndexPage";
import OrderPage from "./pages/OrderPage";
import OrderListPage from "./pages/OrderListPage";

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/mainPage" element={<IndexPage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/orderList" element={<OrderListPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
