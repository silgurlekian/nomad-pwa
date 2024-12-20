import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    setErrorEmail(null);
    setErrorPassword(null);

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

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
      return; // Si la validación falla, no continuar
    }

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/home");
    } catch (err) {
      setErrorEmail(
        err.response ? err.response.data.message : "Error al iniciar sesión"
      );
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
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${errorEmail ? "error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
                      : "/pwa/images/icons/eye.svg"
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

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        {/* Enlace para restablecer la contraseña */}
        <p className="text-center mt-2 forgot-pwd">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/reset-password" className="link">
            Haz click aquí
          </Link>
        </p>
      </div>

      <div className="d-flex separator">
        <hr className="w-100 mr-2" />
        <div>ó</div>
        <hr className="w-100 ml-2" />
      </div>

      <div className="d-flex flex-position">
        <div className="">
          <p className="text-center">¿No tienes una cuenta?</p>
          <Link to="/register" className="d-block link mt-2">
            Regístrate
          </Link>
        </div>
        <Link to="/home" className="d-block link mt-auto pb-2 position-bottom">
          Ver espacios sin cuenta
        </Link>
      </div>
    </div>
  );
};

export default Login;
