import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom"; // Импортируем
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/CartPage"; // Добавляем CartPage
import Order from "./pages/Order";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<Order />} />
      </Routes>
      <Footer />
    </div>
  );
}
export default App;
