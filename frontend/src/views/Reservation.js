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
  const [error, setError] = useState("");
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

  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado.");
      return;
    }

    const reservationDataToSend = {
      userId: "", // El userId lo tomamos del token JWT
      fullName: reservationData.fullName,
      date: reservationData.date,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      additionalNotes: reservationData.additionalNotes,
      numberOfPlaces: reservationData.numberOfPlaces,
      location: spaceDetails?.nombre || "Room A",
    };

    try {
      const response = await fetch("http://localhost:3000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviamos el token para autenticar al usuario
        },
        body: JSON.stringify(reservationDataToSend),
      });

      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      const data = await response.json();
      console.log("Reserva creada:", data);
      setReservationSuccess(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <HeaderSection />
      <div className="reservation-form-container">
        <h2>Reservar espacio: {spaceDetails?.nombre}</h2>
        {reservationSuccess && (
          <div className="reservation-success-message">
            ¡Reserva realizada exitosamente!
          </div>
        )}
        {!isLoggedIn && (
          <div className="error-message">
            Por favor, inicie sesión para realizar la reserva.
          </div>
        )}
        <form onSubmit={handleSubmitReservation}>
          {error && <div className="error-message">{error}</div>}
          <label htmlFor="fullName">Nombre completo:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={reservationData.fullName}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={reservationData.date}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="startTime">Hora de inicio:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={reservationData.startTime}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="endTime">Hora de fin:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={reservationData.endTime}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="numberOfPlaces">Cantidad de lugares:</label>
          <input
            type="number"
            id="numberOfPlaces"
            name="numberOfPlaces"
            min="1"
            value={reservationData.numberOfPlaces}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="additionalNotes">Notas adicionales:</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={reservationData.additionalNotes}
            onChange={handleInputChange}
          />
          <button type="submit">Confirmar reserva</button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
