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
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para confirmar contraseña
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
              placeholder="Ingresa tu nombre completo" // Placeholder agregado
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"} // Cambia entre text y password
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña" // Placeholder agregado
                required
              />
              <span 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Alterna el estado de la confirmación de la contraseña
              >
                <img 
                  src={showConfirmPassword ? "/images/icons/eye-slash.svg" : "/images/icons/eye.svg"} 
                  alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
                  style={{ width: '20px', height: '20px' }} // Ajusta el tamaño del ícono
                />
              </span>
            </div>
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