import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./SpaceNavbar.css";

export const SpaceNavbar = ({ precio }) => {
  const navigate = useNavigate();

  const handleSelectDate = () => {
    navigate("/reservation");
  };

  return (
    <div className="space-navbar fixed-bottom">
      <div className="d-flex align-items-center justify-content-start gap-1 w-100">
        <p className="precio">{precio}</p>
        <p className="moneda">ARS / hora</p>
      </div>

      <button className="btn-primary" onClick={handleSelectDate}>
        Seleccionar fecha
      </button>
    </div>
  );
};

export default SpaceNavbar;
