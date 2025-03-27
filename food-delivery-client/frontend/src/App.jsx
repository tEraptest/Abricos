import React from "react";
import "./styles/App.css"; // Обновленный путь
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header"; // Обновленный путь
import Footer from "./components/Footer/Footer"; // Обновленный путь
import Home from "./pages/Home/Home"; // Обновленный путь
import Catalog from "./pages/Catalog/Catalog"; // Обновленный путь
import CartPage from "./pages/CartPage/CartPage"; // Обновленный путь
import Order from "./pages/Order/Order"; // Обновленный путь
import LoginPage from "./pages/LoginPage/LoginPage"; // Обновленный путь
import RegisterPage from "./pages/RegisterPage/RegisterPage"; // Обновленный путь
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; // Обновленный путь

function App() {
  return (
    <div className="App">
      <Header />
      <main className="app-main-content">
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
