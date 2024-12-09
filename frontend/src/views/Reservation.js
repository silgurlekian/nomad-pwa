import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderSection from "../components/HeaderSection";
import "./Reservation.css";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [spaceDetails, setSpaceDetails] = useState(null);
  const [reservationData, setReservationData] = useState({
    fullName: "",
    date: "",
    startTime: "",
    endTime: "",
    additionalNotes: "",
    numberOfPlaces: 1,
  });
  const [errors, setErrors] = useState({
    fullName: "",
    date: "",
    startTime: "",
    endTime: "",
    numberOfPlaces: "",
  });
  const [reservationSuccess, setReservationSuccess] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        navigate("/login", {
          state: {
            from: location.pathname,
            spaceDetails: location.state?.spaceDetails,
          },
        });
      }
    };

    if (location.state?.spaceDetails) {
      setSpaceDetails(location.state.spaceDetails);
    }

    checkLoginStatus();
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!reservationData.fullName) {
      newErrors.fullName = "El nombre completo es obligatorio.";
      isValid = false;
    }

    if (!reservationData.date) {
      newErrors.date = "La fecha es obligatoria.";
      isValid = false;
    }

    if (!reservationData.startTime) {
      newErrors.startTime = "La hora de inicio es obligatoria.";
      isValid = false;
    }

    if (!reservationData.endTime) {
      newErrors.endTime = "La hora de fin es obligatoria.";
      isValid = false;
    }

    if (reservationData.numberOfPlaces < 1) {
      newErrors.numberOfPlaces = "La cantidad de lugares debe ser al menos 1.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setErrors({ ...errors, general: "No estás autenticado." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const reservationDataToSend = {
      userId: "", // El userId lo toma del token JWT
      fullName: reservationData.fullName,
      date: reservationData.date,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      additionalNotes: reservationData.additionalNotes,
      numberOfPlaces: reservationData.numberOfPlaces,
      location: spaceDetails?.nombre || "Room A",
    };

    try {
      const response = await fetch("https://api-nomad.onrender.com/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationDataToSend),
      });

      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      const data = await response.json();
      console.log("Reserva creada:", data);
      setReservationSuccess(true);

      setTimeout(() => {
        navigate("/reservation-success", {
          state: {
            reservation: data,
            spaceDetails: spaceDetails,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setErrors({ ...errors, general: error.message });
    }
  };

  return (
    <div>
      <HeaderSection title="Completar reserva" />
      <div className="contenido-detalle">
        <h1 className="h4">Reservar espacio: {spaceDetails?.nombre}</h1>

        {reservationSuccess && (
          <div className="alert alert-success">
            ¡Reserva realizada exitosamente!
          </div>
        )}

        {!isLoggedIn && (
          <div className="error-message">
            Por favor, inicie sesión para realizar la reserva.
          </div>
        )}

        <form onSubmit={handleSubmitReservation}>
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-control ${errors.fullName ? "error" : ""}`}
              value={reservationData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha</label>
            <input
              type="date"
              id="date"
              name="date"
              className={`form-control ${errors.date ? "error" : ""}`}
              value={reservationData.date}
              onChange={handleInputChange}
            />
            {errors.date && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errors.date}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Hora de inicio</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              className={`form-control ${errors.startTime ? "error" : ""}`}
              value={reservationData.startTime}
              onChange={handleInputChange}
            />
            {errors.startTime && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errors.startTime}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="endTime">Hora de fin</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              className={`form-control ${errors.endTime ? "error" : ""}`}
              value={reservationData.endTime}
              onChange={handleInputChange}
            />
            {errors.endTime && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errors.endTime}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="numberOfPlaces">Cantidad de lugares</label>
            <input
              type="number"
              id="numberOfPlaces"
              name="numberOfPlaces"
              className={`form-control ${errors.numberOfPlaces ? "error" : ""}`}
              min="1"
              value={reservationData.numberOfPlaces}
              onChange={handleInputChange}
            />
            {errors.numberOfPlaces && (
              <p className="d-flex align-items-center gap-1 error-message mt-2">
                <img
                  src="/images/icons/warning.svg"
                  alt="Advertencia"
                  style={{ width: "16px", height: "16px" }}
                />
                {errors.numberOfPlaces}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="additionalNotes">Notas adicionales</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              className="form-control"
              value={reservationData.additionalNotes}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn-primary">
            Confirmar reserva
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
