import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./HeaderSection.css";

const HeaderSection = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Función para ir a la pantalla anterior
  const handleBackClick = () => {
    navigate(-1);  // Navegar a la página anterior en el historial
  };

  // Función para determinar el texto del encabezado según la ruta actual
  const getHeaderText = () => {
    if (location.pathname === "/profile") {
      return "Mi cuenta"; 
    } else if (location.pathname.startsWith("/detalle")) {
      return "Detalle";
    }
    return ""; 
  };

  return (
    <div className="header-section">
      <header className="header">
        <div className="section" onClick={handleBackClick}>
          <img
            className="white-icon"
            src="../images/icons/arrow-left.svg"
            alt="volver"
          />
          <div className="text-wrapper">{getHeaderText()}</div>
        </div>

        <img src="../images/header-icon.svg" alt="icono" />
      </header>
    </div>
  );
};

export default HeaderSection;
