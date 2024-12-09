import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
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
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/home");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="bkg-home">
          <img alt="" src="/images/login.jpg" />
        </div>
      </div>
      <div className="container">
        <img alt="" src="/images/logo-nomad.svg" />
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico" // Placeholder agregado
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"} // Cambia entre text y password
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña" // Placeholder agregado
                required
              />
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)} // Alterna el estado de la contraseña
              >
                <img 
                  src={showPassword ? "/images/icons/eye-slash.svg" : "/images/icons/eye.svg"} 
                  alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
                  style={{ width: '20px', height: '20px' }} // Ajusta el tamaño del ícono
                />
              </span>
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Entrar
          </button>
          {/* <a href="/forgot-password" className="link">
            ¿Olvidaste tu contraseña?
          </a> */}
        </form>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="d-flex separator">
        <div className="line"></div>
        <hr className="w-100"/>
        <div>ó</div>
        <hr className="w-100"/>
      </div>
      <p className="text-center">¿No tienes una cuenta?</p>
      <a href="/register" className="d-block link">
        Regístrate
      </a>

      <a href="/home" className="d-block link mt-auto pb-5">
        Ver espacios sin cuenta
      </a>
    </div>
  );
};

export default Login;