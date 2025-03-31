import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../store/slices/authSlice";
import Input from "../UI/Input/Input";
import Button from "../UI/Button";
import "./LoginForm.css";

function LoginForm() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.rejected.match(resultAction)) {
      setError("serverError", {
        type: "manual",
        message: resultAction.payload,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>Вход</h2>

      <Input
        label="Имя пользователя"
        id="login-username"
        {...register("username", {
          required: "Имя пользователя обязательно",
        })}
        error={errors.username}
        autoComplete="username"
      />

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

      {errors.serverError && (
        <p className="error-message">{errors.serverError.message}</p>
      )}
      {error && !errors.serverError && <p className="error-message">{error}</p>}

      <Button type="submit" disabled={isLoading} className="auth-button">
        {isLoading ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}

export default LoginForm;
