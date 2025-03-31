import React, { useState, useEffect } from "react";
import "./Slider.css"; // Исправлен путь

function Slider({ items = [], interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items || items.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className="slider">
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div className="slide" key={item.id}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img src={item.imageUrl} alt={item.alt} />
            </a>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button className="slider-button prev" onClick={goToPrevious}>
            ❮
          </button>
          <button className="slider-button next" onClick={goToNext}>
            ❯
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="slider-dots">
          {items.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;
