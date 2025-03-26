import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            {/* Убедись, что logo.png лежит в папке public */}
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
              {/* Добавь реальные категории */}
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
                {/* ... */}
              </ul>
            </div>
          )}

          <div className="header-search">
            <input type="text" placeholder="Поиск по каталогу" />
            <button>Найти</button>
          </div>
        </div>

        <div className="header-actions">
          <button>Войти</button>
          <Link to="/favorites">Избранное</Link>
          <Link to="/cart">Корзина</Link>
        </div>
        <div className="header-address">
          <button>Выберите адрес</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
