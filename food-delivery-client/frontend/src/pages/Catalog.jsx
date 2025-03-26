import React from "react";
import ProductList from "../components/ProductList";

// Заглушка для списка товаров (пока без данных с сервера)
const dummyProducts = [
  { id: 1, name: "Хлеб", price: 25 },
  { id: 2, name: "Молоко", price: 60 },
  { id: 3, name: "Яйца", price: 80 },
];

function Catalog() {
  return (
    <div>
      <h2>Каталог товаров</h2>
      <ProductList products={dummyProducts} />
    </div>
  );
}

export default Catalog;
