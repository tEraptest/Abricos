import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import "./Header.css";

function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="Логотип" />
        </Link>
        <div className="header-search">
          <input type="text" placeholder="Найти товар" />
          <button>🔍</button>
        </div>
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span>Привет, {user?.username || "Пользователь"}!</span>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">
                Войти
              </Link>
              <Link to="/register" className="register-button">
                Регистрация
              </Link>
            </>
          )}
          <Link to="/cart" className="cart-button">
            🛒 Корзина
          </Link>
        </div>
      </div>
      <div className="header-main">
        <div className="header-navigation">
          <button className="catalog-button" onClick={toggleCatalog}>
            Каталог
          </button>
          {isCatalogOpen && (
            <div className="catalog-menu">
              <ul>
                <li>
                  <Link to="/catalog?category=milk">Молоко, сыр, яйца</Link>
                </li>
                <li>
                  <Link to="/catalog?category=bread">Хлеб</Link>
                </li>
                <li>
                  <Link to="/catalog?category=fruits">Овощи, фрукты</Link>
                </li>
                <li>
                  <Link to="/catalog?category=meat">Мясо, птица</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
