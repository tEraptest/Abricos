import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../store/authSlice";
import Input from "./UI/Input"; // Наш кастомный Input
import Button from "./UI/Button"; // Наш кастомный Button (или обычный button)
import "./LoginForm.module.css"; // Общие стили для форм авторизации (создадим)

function LoginForm() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth); // Получаем статус загрузки и ошибку из Redux

  const {
    register, // Функция для регистрации поля в форме
    handleSubmit, // Функция для обработки отправки формы
    formState: { errors }, // Объект с ошибками валидации
    setError, // Функция для установки кастомных ошибок
  } = useForm();

  // Очищаем ошибку при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Обработчик отправки формы
  const onSubmit = async (data) => {
    // Вызываем async thunk loginUser
    const resultAction = await dispatch(loginUser(data));

    // Если loginUser вернул ошибку (rejected)
    if (loginUser.rejected.match(resultAction)) {
      // Устанавливаем ошибку для поля username или password,
      // чтобы она отобразилась под полем ввода
      setError("serverError", {
        type: "manual",
        message: resultAction.payload,
      });
      // Или можно установить для конкретного поля:
      // setError('username', { type: 'manual', message: resultAction.payload });
    }
    // Если все успешно, редирект произойдет на уровне страницы LoginPage
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Вход</h2>

      {/* Поле Username */}
      <Input
        label="Имя пользователя"
        id="login-username"
        // Регистрируем поле с валидацией
        {...register("username", {
          required: "Имя пользователя обязательно",
        })}
        // Передаем ошибку, если она есть для этого поля
        error={errors.username}
        autoComplete="username"
      />

      {/* Поле Password */}
      <Input
        label="Пароль"
        id="login-password"
        type="password"
        {...register("password", {
          required: "Пароль обязателен",
        })}
        error={errors.password}
        autoComplete="current-password"
      />

      {/* Отображение общей ошибки сервера */}
      {errors.serverError && (
        <p className="error-message">{errors.serverError.message}</p>
      )}
      {/* Или можно использовать глобальную ошибку из Redux state */}
      {error && !errors.serverError && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}

export default LoginForm;
