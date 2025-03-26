import React from "react";
import { Link } from "react-router-dom";
import "./CategoryCard.css";

function CategoryCard({ name, imageUrl, link }) {
  return (
    <Link to={link} className="category-card">
      <div className="category-card-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="category-card-name">{name}</div>
    </Link>
  );
}

export default CategoryCard;
