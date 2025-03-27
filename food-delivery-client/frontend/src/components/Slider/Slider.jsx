import React, { useState, useEffect } from "react";
import "../styles/components/Slider.css"; // Updated path for styles

function Slider({ items = [], interval = 5000 }) {
  // Добавили интервал по умолчанию
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return; // Не запускаем таймер, если слайдов мало

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);

    return () => clearInterval(timer); // Очищаем таймер при размонтировании
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
              {" "}
              {/* Открываем в новой вкладке */}
              <img src={item.imageUrl} alt={item.alt} />
            </a>
          </div>
        ))}
      </div>

      {items.length > 1 && ( // Показываем кнопки только если слайдов больше одного
        <>
          <button className="slider-button prev" onClick={goToPrevious}>
            ❮
          </button>
          <button className="slider-button next" onClick={goToNext}>
            ❯
          </button>
        </>
      )}

      {/* Индикаторы (точки) */}
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
