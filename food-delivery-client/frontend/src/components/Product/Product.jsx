import React from "react";
import "./Product.module.css"; // Updated path for styles

function Product({ product }) {
  // Функция для обработки клика по кнопке "Добавить" (пока заглушка)
  const handleAddToCart = (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке, если карточка - ссылка
    console.log("Добавить в корзину:", product.name);
    // Здесь будет логика добавления в корзину (Redux или Context API)
  };

  // Функция для обработки клика по "Избранному" (пока заглушка)
  const handleToggleFavorite = (event) => {
    event.preventDefault();
    console.log("В избранное/Убрать из избранного:", product.name);
    // Здесь будет логика избранного
  };

  return (
    // Можно обернуть карточку в Link, если нужно перейти на страницу товара
    // <Link to={`/product/${product.id}`} className="product">
    <div className="product">
      <div className="product-image-container">
        {/* Значок скидки */}
        {product.oldPrice && (
          <span className="discount-badge">
            -
            {Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100
            )}
            %
          </span>
        )}
        {/* Иконка избранного (пока заглушка) */}
        <button className="favorite-button" onClick={handleToggleFavorite}>
          {/* <HeartIcon className="favorite-icon" /> */}♡{" "}
          {/* Простой символ сердечка */}
        </button>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {/* Можно добавить рейтинг, вес/объем и т.п. */}
        <div className="product-price-container">
          <span className="product-price">{product.price} руб.</span>
          {product.oldPrice && (
            <span className="product-old-price">{product.oldPrice} руб.</span>
          )}
        </div>
      </div>

      <button className="add-to-cart-button" onClick={handleAddToCart}>
        {/* <ShoppingCartIcon className="cart-icon" /> */}В корзину
      </button>
    </div>
    // </Link>
  );
}

export default Product;
