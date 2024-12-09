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
  const [errorNombre, setErrorNombre] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setErrorNombre(null);
    setErrorEmail(null);
    setErrorPassword(null);

    // Validar el nombre
    if (!nombre) {
      setErrorNombre("El nombre completo es obligatorio.");
      isValid = false;
    }

    // Validar el correo electrónico
    if (!email) {
      setErrorEmail("El correo electrónico es obligatorio.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Por favor ingresa un correo electrónico válido.");
      isValid = false;
    }

    // Validar la contraseña
    if (!password) {
      setErrorPassword("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
      setErrorPassword("Las contraseñas no coinciden.");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
      return; // Si la validación falla, no continuar
    }

    try {
      const data = await registerUser({ nombre, email, password });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setErrorEmail(err.response ? err.response.data.message : "Error al registrar");
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
        <h2>Crea tu cuenta</h2>
        <p className="text-center">
          Únete a nomad para encontrar y reservar espacios de trabajo
        </p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              className={`form-control ${errorNombre ? 'error' : ''}`}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrorNombre(null); // Reiniciar error al cambiar el valor
              }}
              placeholder="Ingresa tu nombre completo"
            />
            {errorNombre && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img src="/images/icons/warning.svg" alt="Advertencia" style={{ width: '16px', height: '16px' }} />
                {errorNombre}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${errorEmail ? 'error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorEmail(null); // Reiniciar error al cambiar el valor
              }}
              placeholder="Ingresa tu correo electrónico"
            />
            {errorEmail && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img src="/images/icons/warning.svg" alt="Advertencia" style={{ width: '16px', height: '16px' }} />
                {errorEmail}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errorPassword ? 'error' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorPassword(null); // Reiniciar error al cambiar el valor
                }}
                placeholder="Ingresa tu contraseña"
              />
              <span 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img 
                  src={showPassword ? "/images/icons/eye-slash.svg" : "/images/icons/eye.svg"} 
                  alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
                  style={{ width: '20px', height: '20px' }} 
                />
              </span>
            </div>
            {errorPassword && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img src="/images/icons/warning.svg" alt="Advertencia" style={{ width: '16px', height: '16px' }} />
                {errorPassword}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errorPassword ? 'error' : ''}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Reiniciar error solo si se está cambiando la confirmación
                  if (e.target.value === password) {
                    setErrorPassword(null); 
                  }
                }}
                placeholder="Confirma tu contraseña"
              />
              <span 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img 
                  src={showConfirmPassword ? "/images/icons/eye-slash.svg" : "/images/icons/eye.svg"} 
                  alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"} 
                  style={{ width: '20px', height: '20px' }} 
                />
              </span>
            </div>
            {/* Mostrar error específico para confirmación si es necesario */}
            {password && confirmPassword && password !== confirmPassword && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img src="/images/icons/warning.svg" alt="Advertencia" style={{ width: '16px', height: '16px' }} />
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
        <hr className="w-100"/>
        <div>ó</div>
        <hr className="w-100"/>
      </div>
      <p className="text-center">¿Ya tienes una cuenta?</p>
      <a href="/login" className="d-block link">
        Inicia sesión
      </a>
    </div>
  );
};

export default Register;