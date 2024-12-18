import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setErrorNombre(null);
    setErrorEmail(null);
    setErrorPassword(null);

    if (!nombre) {
      setErrorNombre("El nombre completo es obligatorio.");
      isValid = false;
    }

    if (!email) {
      setErrorEmail("El correo electrónico es obligatorio.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Por favor ingresa un correo electrónico válido.");
      isValid = false;
    }

    if (!password) {
      setErrorPassword("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setErrorPassword("Las contraseñas no coinciden.");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerUser({ nombre, email, password });

      setSuccessMessage("¡Registro exitoso! Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error al registrar:", err);

      if (err.response) {
        const errorMessage =
          err.response.data.message || "Error desconocido al registrar.";

        if (errorMessage === "El usuario ya existe") {
          setErrorEmail("El correo electrónico ya está registrado.");
        } else {
          setErrorEmail(errorMessage);
        }
      } else {
        const errorMessage = err.message || "Error desconocido al registrar.";
        setErrorEmail(errorMessage);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="bkg-home">
          <img alt="" src="/pwa/images/login.jpg" />
        </div>
      </div>
      <div className="container">
        <img alt="" src="/pwa/images/logo-nomad.svg" />
        <h2>Crea tu cuenta</h2>
        <p className="text-center">
          Únete a nomad para encontrar y reservar espacios de trabajo
        </p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              className={`form-control ${errorNombre ? "error" : ""}`}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrorNombre(null); // Reiniciar error al cambiar el valor
              }}
              placeholder="Ingresa tu nombre completo"
            />
            {errorNombre && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/pwa/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errorNombre}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${errorEmail ? "error" : ""}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorEmail(null);
              }}
              placeholder="Ingresa tu correo electrónico"
            />
            {errorEmail && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/pwa/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errorEmail}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errorPassword ? "error" : ""}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorPassword(null);
                }}
                placeholder="Ingresa tu contraseña"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={
                    showPassword
                      ? "/pwa/images/icons/eye-slash.svg"
                      : "/pwa//images/icons/eye.svg"
                  }
                  alt={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
            </div>
            {errorPassword && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/pwa/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errorPassword}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errorPassword ? "error" : ""}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                placeholder="Confirma tu contraseña"
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  src={
                    showConfirmPassword
                      ? "/pwa/images/icons/eye-slash.svg"
                      : "/pwa//images/icons/eye.svg"
                  }
                  alt={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/pwa/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                Las contraseñas no coinciden.
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Registrarse
          </button>
        </form>
      </div>

      <div className="d-flex separator">
        <div className="line"></div>
        <hr className="w-100" />
        <div>ó</div>
        <hr className="w-100" />
      </div>
      <p className="text-center">¿Ya tienes una cuenta?</p>
      <Link to="/login" className="d-block link">
        Inicia sesión
      </Link>
    </div>
  );
};

export default Register;
