import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice"; // Обновленный путь
import productsReducer from "./slices/productsSlice"; // Обновленный путь
import authReducer from "./slices/authSlice"; // Обновленный путь

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});
