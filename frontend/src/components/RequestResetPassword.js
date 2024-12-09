import React, { useState } from "react";
import { requestPasswordReset } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const RequestResetPassword = () => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const validateEmail = (email) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();

    // Validar el correo electrónico
    if (!validateEmail(resetEmail)) {
      setResetError("Por favor ingresa un correo electrónico válido.");
      setResetSuccess(null);
      return;
    }

    try {
      await requestPasswordReset({ email: resetEmail });
      setResetSuccess(
        "Se ha enviado un enlace para restablecer tu contraseña."
      );
      setResetError(null);
    } catch (err) {
      setResetError(
        err.response
          ? err.response.data.message
          : "Error al solicitar el restablecimiento de contraseña."
      );
      setResetSuccess(null);
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
        <h2>Restablecer contraseña</h2>
        <form onSubmit={handleRequestReset}>
          <div className="form-group">
            <label htmlFor="reset-email">Correo electrónico</label>
            <input
              type="email"
              id="reset-email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              className={`form-control ${resetError ? "error" : ""}`}
            />
            {resetError && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {resetError}
              </p>
            )}
          </div>
          {resetSuccess && <p className="success-message">{resetSuccess}</p>}
          <button type="submit" className="btn-primary">
            Recuperar contraseña
          </button>
        </form>
      </div>

      <div className="d-flex separator mt-4">
        <hr className="w-100" />
        <div>ó</div>
        <hr className="w-100" />
      </div>
      <p className="text-center">¿Ya tienes una cuenta?</p>
      <a href="/login" className="d-block link">
        Inicia Sesión
      </a>
    </div>
  );
};

export default RequestResetPassword;
