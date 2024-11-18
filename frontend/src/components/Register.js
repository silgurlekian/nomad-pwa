import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";
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
      localStorage.setItem("user", JSON.stringify(data)); // Asegúrate de que 'data' incluya 'createdAt'
      localStorage.setItem("token", data.token); // Si tu API devuelve un token
      navigate("/login"); // Redirigir a la página de login después del registro
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error al registrar");
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
        <div>
          <h2>Crea tu cuenta</h2>
          <p className="text-center">
            Únete a nomad para encontrar y reservar espacios de trabajo
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="d-flex separator">
        <div className="line"></div>
        <div>ó</div>
        <div className="line"></div>
      </div>
      <p className="text-center">¿Ya tienes una cuenta?</p>
      <a href="/login" className="d-block link">
        Inicia sesión
      </a>

      <a href="/home" className="d-block link mt-5">
        Ver espacios sin cuenta
      </a>
    </div>
  );
};

export default Register;
