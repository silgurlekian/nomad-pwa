import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/AuthService";
import "../App.css";
import "./Login.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para confirmar la contraseña
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false); // Estado para mostrar/ocultar nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmar contraseña
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `https://nomad-vzpq.onrender.com/api/auth/reset-password/${token}`
        );
        if (!response.ok) throw new Error("Token inválido o expirado.");
        const data = await response.json();
        console.log(data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    verifyToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess("Contraseña restablecida con éxito.");
      setError(null);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Error al restablecer la contraseña."
      );
      setSuccess(null);
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
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="new-password">Nueva Contraseña</label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className={`form-control ${error ? "error" : ""}`}
              />
              <span
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <img
                  src={
                    showNewPassword
                      ? "/pwa/images/icons/eye-slash.svg"
                      : "/pwa/images/icons/eye.svg"
                  }
                  alt={
                    showNewPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
            </div>
            {error && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/pwa/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {error}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className={`form-control ${error ? "error" : ""}`}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  src={
                    showConfirmPassword
                      ? "/pwa/images/icons/eye-slash.svg"
                      : "/pwa/images/icons/eye.svg"
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
          </div>

          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="btn-primary">
            Restablecer Contraseña
          </button>
        </form>
      </div>

      <div className="d-flex separator mt-4">
        <hr className="w-100" />
        <div>ó</div>
        <hr className="w-100" />
      </div>
      <p className="text-center">¿Ya tienes una cuenta?</p>
      <Link to="/login" className="d-block link">
        Inicia Sesión
      </Link>
    </div>
  );
};

export default ResetPassword;
