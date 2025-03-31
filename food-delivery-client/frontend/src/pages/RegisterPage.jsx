import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm/RegisterForm"; // Corrected path

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Если пользователь уже аутентифицирован, перенаправляем на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-page">
      <RegisterForm />
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
