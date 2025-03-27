import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Используем useNavigate для редиректа
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Или в личный кабинет, если он есть
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <LoginForm />
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;
