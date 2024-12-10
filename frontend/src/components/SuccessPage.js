import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SuccessPage.css";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;
  const spaceDetails = location.state?.spaceDetails; // Obtener los detalles del espacio

  const handleRedirect = () => {
    navigate("/home");
  };

  return (
    <div className="success-wrapper">
      <div className="success-icon">
        <img src="../images/icons/circle-success.svg" alt="Reserva exitosa" />
      </div>
      <h2 className="success-title">Reserva confirmada!</h2>
      <p className="success-description">
        Preséntate en el espacio de trabajo y presenta este código.
        <br />
        Se te cobrará en el lugar directamente.
      </p>
      <div className="reservation-code">{reservation?.code || "FGHJ56"}</div>
      <div className="reservation-details">
        <div className="d-flex space-detail">
          <p>{spaceDetails?.nombre || "Nombre no disponible"}</p>
          <p>{spaceDetails?.direccion || "Dirección no disponible"}</p>
        </div>
        <div className="reservation-meta">
          <div>
            <img src="../images/icons/calendar.svg" alt="Reserva exitosa" />{" "}
            {reservation?.date}
          </div>
          <div>
            <img src="../images/icons/clock.svg" alt="Reserva exitosa" />{" "}
            {`${reservation?.startTime} - ${reservation?.endTime}`}
          </div>
          <div>
            <img
              src="../images/icons/format-circle.svg"
              alt="Reserva exitosa"
            />{" "}
            {reservation?.numberOfPlaces}
          </div>
        </div>
      </div>
      <button onClick={handleRedirect} className="btn-primary">
        Finalizar
      </button>
    </div>
  );
};

export default SuccessPage;
