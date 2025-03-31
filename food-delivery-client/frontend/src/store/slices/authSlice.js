import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, registerUserApi } from "../../services/authApi"; // Исправлен путь

// --- Async Thunks (Асинхронные операции) ---

// Thunk для входа пользователя
export const loginUser = createAsyncThunk(
  "auth/loginUser", // Уникальное имя для этого thunk
  async (loginData, { rejectWithValue }) => {
    try {
      // Вызываем функцию API для логина
      const data = await loginUserApi(loginData);
      // Сохраняем токен в localStorage (для сохранения сессии между перезагрузками)
      localStorage.setItem("userToken", data.token);
      // Возвращаем успешные данные (токен и имя пользователя)
      return data;
    } catch (error) {
      // Если API вернуло ошибку, извлекаем сообщение
      const errorMessage =
        error.response?.data || error.message || "Login failed";
      // Возвращаем ошибку через rejectWithValue
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(registerData);
      localStorage.setItem("userToken", data.token);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Registration failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// --- Slice Definition (Определение слайса) ---

const initialState = {
  token: localStorage.getItem("userToken") || null, // Пытаемся взять токен из localStorage при загрузке
  user: null, // Здесь можно хранить доп. инфо о пользователе, если API ее вернет
  isAuthenticated: !!localStorage.getItem("userToken"), // true, если токен есть
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  // Синхронные редьюсеры
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken"); // Удаляем токен из localStorage
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },
    // Можно добавить редьюсер для очистки ошибки
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  // Обработка асинхронных thunks (extraReducers)
  extraReducers: (builder) => {
    builder
      // --- Обработка loginUser ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Сбрасываем ошибку при новом запросе
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = { username: action.payload.username }; // Сохраняем имя пользователя
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload; // Записываем сообщение об ошибке
      })
      // --- Обработка registerUser ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = { username: action.payload.username };
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload;
      });
  },
});

// Экспортируем синхронные actions
export const { logout, clearAuthError } = authSlice.actions;

// Экспортируем редьюсер
export default authSlice.reducer;
