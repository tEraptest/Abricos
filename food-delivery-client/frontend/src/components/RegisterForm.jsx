import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../store/authSlice";
import Input from "./UI/Input";
import Button from "./UI/Button";
import "./AuthForm.css";

function RegisterForm() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch, // Для проверки совпадения паролей
    formState: { errors },
    setError,
  } = useForm();

  // Очищаем ошибку при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    // Удаляем confirmPassword перед отправкой на сервер
    const { confirmPassword, ...registerData } = data;
    const resultAction = await dispatch(registerUser(registerData));

    if (registerUser.rejected.match(resultAction)) {
      setError("serverError", {
        type: "manual",
        message: resultAction.payload,
      });
    }
    // Редирект на уровне страницы RegisterPage
  };

  // Получаем текущее значение поля password для валидации confirmPassword
  const passwordValue = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Регистрация</h2>

      <Input
        label="Имя пользователя"
        id="register-username"
        {...register("username", {
          required: "Имя пользователя обязательно",
          minLength: { value: 3, message: "Минимум 3 символа" },
        })}
        error={errors.username}
        autoComplete="username"
      />

      <Input
        label="Email"
        id="register-email"
        type="email"
        {...register("email", {
          required: "Email обязателен",
          pattern: {
            // Простая проверка email
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Некорректный email",
          },
        })}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        label="Имя" // Опционально
        id="register-firstName"
        {...register("firstName")}
        error={errors.firstName}
        autoComplete="given-name"
      />

      <Input
        label="Фамилия" // Опционально
        id="register-lastName"
        {...register("lastName")}
        error={errors.lastName}
        autoComplete="family-name"
      />

      <Input
        label="Пароль"
        id="register-password"
        type="password"
        {...register("password", {
          required: "Пароль обязателен",
          minLength: { value: 6, message: "Минимум 6 символов" },
        })}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        label="Подтвердите пароль"
        id="register-confirmPassword"
        type="password"
        {...register("confirmPassword", {
          required: "Подтверждение пароля обязательно",
          validate: (value) => value === passwordValue || "Пароли не совпадают", // Проверка совпадения
        })}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {/* Отображение общей ошибки сервера */}
      {errors.serverError && (
        <p className="error-message">{errors.serverError.message}</p>
      )}
      {error && !errors.serverError && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </Button>
    </form>
  );
}

export default RegisterForm;
