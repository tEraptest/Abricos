import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice"; // Исправлен путь
import "./Header.css"; // Исправлен путь

function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Получаем статус аутентификации и имя пользователя из Redux store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  // Обработчик выхода
  const handleLogout = () => {
    dispatch(logout()); // Вызываем action logout
    // Можно добавить редирект на главную или страницу входа
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Логотип, Каталог, Поиск - остаются без изменений */}
        <div className="header-logo">
          <Link to="/">
            <img src="/logo.png" alt="Логотип магазина" />
          </Link>
        </div>

        <div className="header-navigation">
          <button className="catalog-button" onClick={toggleCatalog}>
            <span className="catalog-button-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
            Каталог
          </button>
          {isCatalogOpen && (
            <div className="catalog-menu">
              <ul>
                <li>
                  <Link
                    to="/catalog?category=milk"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    Молоко, сыр, яйца
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?category=bread"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    Хлеб
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?category=fruits"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    Овощи, фрукты
                  </Link>
                </li>
                <li>
                  <Link
                    to="/catalog?category=meat"
                    onClick={() => setIsCatalogOpen(false)}
                  >
                    Мясо, птица
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <div className="header-search">
            <input type="text" placeholder="Поиск по каталогу" />
            <button>Найти</button>
          </div>
        </div>

        {/* Блок действий пользователя */}
        <div className="header-actions">
          {isAuthenticated ? (
            // Если пользователь вошел
            <>
              {/* Можно добавить ссылку на профиль */}
              {/* <Link to="/profile">{user?.username || 'Профиль'}</Link> */}
              <span className="header-username">
                Привет, {user?.username || "Пользователь"}!
              </span>
              <Link to="/favorites">Избранное</Link>
              <Link to="/cart">Корзина</Link>
              <button onClick={handleLogout} className="logout-button">
                Выйти
              </button>
            </>
          ) : (
            // Если пользователь не вошел
            <>
              <Link to="/login" className="login-button">
                Войти
              </Link>
              <Link to="/register" className="register-button">
                Регистрация
              </Link>
              {/* Можно скрыть избранное и корзину для неавторизованных */}
              {/* <Link to="/cart">Корзина</Link> */}
            </>
          )}
        </div>

        {/* Адрес - остается без изменений */}
        <div className="header-address">
          <button>Выберите адрес</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
