import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./HeaderSection.css";

const HeaderSection = ({ title }) => {
  // Agregamos una propiedad "title"
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="header-section">
      <header className="header">
        <div className="section" onClick={handleBackClick}>
          <img
            className="white-icon"
            src="../pwa/images/icons/arrow-left.svg"
            alt="volver"
          />
          <div className="text-wrapper">{title || "Mi cuenta"}</div>{" "}
          {/* Título dinámico */}
        </div>
        <img src="../pwa/images/header-icon.svg" alt="icono" />
      </header>
    </div>
  );
};

export default HeaderSection;
