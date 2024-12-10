import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./SpaceNavbar.css";

export const SpaceNavbar = ({ precio, spaceDetails }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // El usuario está logueado
    }
  }, []);

  const handleSelectDate = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirigir al login si no está logueado
      return; // Detener la ejecución de la función
    }

    // Solo proceder a la página de reserva si el usuario está logueado
    navigate("/reservation", {
      state: {
        spaceDetails: spaceDetails,
      },
    });
  };

  return (
    <div className="space-navbar fixed-bottom">
      <div className="d-flex align-items-center justify-content-start gap-1 w-100">
        <p className="precio">{precio}</p>
        <p className="moneda">ARS / hora</p>
      </div>

      <button
        className="btn-primary"
        onClick={handleSelectDate}
      >
        {isLoggedIn ? "Seleccionar fecha" : "Inicia sesión para continuar"}
      </button>
    </div>
  );
};

export default SpaceNavbar;
