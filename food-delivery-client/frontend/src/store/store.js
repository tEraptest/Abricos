import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; // Предполагаем, что он у тебя есть
import productsReducer from "./productsSlice"; // Предполагаем, что он у тебя есть
import authReducer from "./authSlice"; // Импортируем новый редьюсер

export const store = configureStore({
  reducer: {
    auth: authReducer, // Добавляем authReducer
    cart: cartReducer,
    products: productsReducer,
    // Добавь другие редьюсеры, если они есть
  },
});
