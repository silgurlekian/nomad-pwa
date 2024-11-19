import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const data = await registerUser({ nombre, email, password });
      // Almacenar datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error al registrar");
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
        <div>
          <h2>Crea tu cuenta</h2>
          <p className="text-center">
            Únete a nomad para encontrar y reservar espacios de trabajo
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Registrarse
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="d-flex separator">
        <div className="line"></div>
        <div>ó</div>
        <div className="line"></div>
      </div>
      <div className="mb-5 pb-5">
        <p className="text-center">¿Ya tienes una cuenta?</p>
        <a href="/login" className="d-block link">
          Inicia sesión
        </a>
      </div>
    </div>
  );
};

export default Register;
