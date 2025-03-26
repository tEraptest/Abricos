import React from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import CategoryCard from "../components/CategoryCard";
import ProductList from "../components/ProductList";
import "./Home.css";

// --- Заглушки данных ---
const sliderItems = [
  {
    id: 1,
    imageUrl: "https://placehold.co/1160x350/F57A5D/FFF?text=Горячие+Скидки!",
    alt: "Скидки",
    link: "/catalog?filter=discount",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/1160x350/F9A857/333?text=Новинки+Недели",
    alt: "Новинки",
    link: "/catalog?filter=new",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/1160x350/FCDA8A/333?text=Свежие+Фрукты",
    alt: "Фрукты",
    link: "/catalog?category=fruits",
  },
];

const mainCategories = [
  {
    id: "cat1",
    name: "Фрукты и овощи",
    imageUrl: "https://placehold.co/150x120/FCDA8A/333?text=Фрукты",
    link: "/catalog?category=fruits",
  },
  {
    id: "cat2",
    name: "Молоко и яйца",
    imageUrl: "https://placehold.co/150x120/FFF/333?text=Молоко",
    link: "/catalog?category=milk",
  },
  {
    id: "cat3",
    name: "Мясо и птица",
    imageUrl: "https://placehold.co/150x120/A3333D/FFF?text=Мясо",
    link: "/catalog?category=meat",
  },
  {
    id: "cat4",
    name: "Хлеб и выпечка",
    imageUrl: "https://placehold.co/150x120/F9A857/333?text=Хлеб",
    link: "/catalog?category=bread",
  },
  {
    id: "cat5",
    name: "Напитки",
    imageUrl: "https://placehold.co/150x120/F57A5D/FFF?text=Напитки",
    link: "/catalog?category=drinks",
  },
  {
    id: "cat6",
    name: "Бакалея",
    imageUrl: "https://placehold.co/150x120/eee/333?text=Бакалея",
    link: "/catalog?category=grocery",
  },
  {
    id: "cat7",
    name: "Заморозка",
    imageUrl: "https://placehold.co/150x120/add/333?text=Заморозка",
    link: "/catalog?category=frozen",
  },
];

const discountedProducts = [
  {
    id: 10,
    name: "Абрикосы свежие",
    price: 199,
    oldPrice: 250,
    imageUrl: "https://placehold.co/200x150/F9A857/333?text=Абрикос",
  },
  {
    id: 11,
    name: "Персики инжирные",
    price: 249,
    oldPrice: 320,
    imageUrl: "https://placehold.co/200x150/F57A5D/FFF?text=Персик",
  },
  {
    id: 12,
    name: "Малина свежая 125г",
    price: 180,
    oldPrice: 220,
    imageUrl: "https://placehold.co/200x150/E64C65/FFF?text=Малина",
  },
  {
    id: 13,
    name: "Нектарины гладкие",
    price: 175,
    oldPrice: 210,
    imageUrl: "https://placehold.co/200x150/FCDA8A/333?text=Нектарин",
  },
  {
    id: 14,
    name: "Вишня сладкая",
    price: 350,
    oldPrice: 420,
    imageUrl: "https://placehold.co/200x150/A3333D/FFF?text=Вишня",
  },
  {
    id: 15,
    name: "Сливы красные",
    price: 150,
    oldPrice: 190,
    imageUrl: "https://placehold.co/200x150/A3333D/EEE?text=Слива",
  },
];
// ---------------------------------------------------------

function Home() {
  return (
    <div className="home">
      <section className="home-section slider-section">
        <Slider items={sliderItems} />
      </section>

      {/* Убрал секцию "Зеленая линия" для упрощения, можно вернуть по аналогии */}

      <section className="home-section category-section">
        <div className="section-header">
          <h2>Категории товаров</h2>
          <Link to="/catalog" className="section-link">
            Все категории ›
          </Link>
        </div>
        <div className="category-list">
          {mainCategories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              link={category.link}
            />
          ))}
        </div>
      </section>

      <section className="home-section discount-section">
        <div className="section-header">
          <h2>Вкусные скидки</h2>
          <Link to="/catalog?filter=discount" className="section-link">
            Все скидки ›
          </Link>
        </div>
        <div className="product-list-horizontal">
          <ProductList products={discountedProducts} />
        </div>
      </section>
    </div>
  );
}

export default Home;
