import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); 
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token); 
      navigate("/home"); 
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <div>
      <div className="header">
        <div className="bkg-home">
          <img alt="" src="/images/login.jpg" />
        </div>
      </div>
      <div className="container">
        <img alt="" src="/images/logo-nomad.svg" />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          <a href="/forgot-password" className="link">
            ¿Olvidaste tu contraseña?
          </a>
        </form>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="d-flex separator">
        <div className="line"></div>
        <div>ó</div>
        <div className="line"></div>
      </div>
      <p className="text-center">¿No tienes una cuenta?</p>
      <a href="/register" className="d-block link">
        Regístrate
      </a>

      <a href="/home" className="d-block link mt-5">Ver espacios sin cuenta</a>
    </div>
  );
};

export default Login;