import React from "react";
import Product from "./Product";
// Update import to use local module CSS
import "./ProductList.module.css";

function ProductList({ products }) {
  return (
    <div>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList; // Вот эта строка!
