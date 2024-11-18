import React from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./HeaderSection.css";

const HeaderSection = () => {
  const navigate = useNavigate(); 

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className="header-section">
      <header className="header">
        <div className="section" onClick={handleBackClick}>
          {" "}
          <img
            className="white-icon"
            src="../icons/arrow-left.svg"
            alt="volver"
          />
          <div className="text-wrapper">Mi cuenta</div>
        </div>

        <img src="../images/header-icon.svg" alt="icono" />
      </header>
    </div>
  );
};

export default HeaderSection;
