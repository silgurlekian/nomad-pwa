import React, { useState, useEffect } from "react";
import "../App.css";
import "./Profile.css";
import HeaderSection from "../components/HeaderSection";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const MyAccount = () => {
  const [cargando, setLoading] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getReservations = async () => {
      try {
        const response = await fetch(
          "https://nomad-vzpq.onrender.com/api/reservations/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching reservations: ${response.status}`);
        }

        const data = await response.json();

        const reservasConDetalles = await Promise.all(
          data.map(async (reserva) => {
            const spaceResponse = await fetch(
              `https://nomad-vzpq.onrender.com/api/spaces/${reserva.spaceId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (spaceResponse.ok) {
              const spaceData = await spaceResponse.json();
              return {
                ...reserva,
                spaceName: spaceData.nombre,
                spaceAddress: spaceData.direccion,
                spaceCity: spaceData.ciudad,
              };
            }

            return reserva;
          })
        );

        setReservas(reservasConDetalles);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setLoading(false);
      }
    };

    if (storedUser) {
      getReservations();
    } else {
      setLoading(false);
    }
  }, [storedUser]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(
        `https://nomad-vzpq.onrender.com/api/reservations/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error canceling reservation: ${response.status}`);
      }

      setReservas(
        reservas.filter((reservation) => reservation._id !== reservationId)
      );
      setShowModal(false); // Cerrar el modal después de la cancelación
      setSuccessMessage("Reserva eliminada correctamente."); // Mostrar mensaje de éxito
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar mensaje después de 3 segundos
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  const handleShowModal = (reservationId) => {
    setReservationToCancel(reservationId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReservationToCancel(null);
  };

  if (cargando) {
    return <Loading />;
  }

  if (!storedUser) {
    return (
      <div>
        <HeaderSection />
        <div className="my-account text-center">
          <img
            src="../pwa/images/icons/warning-big.svg"
            alt=""
            className="warning-icon"
          />
          <p>Debes iniciar sesión para acceder a esta página.</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Iniciar Sesión
          </button>
        </div>
        <Navbar />
      </div>
    );
  }

  const user = storedUser;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleReserveNewSpace = () => {
    navigate("/home");
  };

  return (
    <div>
      <HeaderSection title="Mi cuenta" />

      {/* Mostrar el mensaje de éxito si existe */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <div className="my-account">
        <div className="user-info">
          <p>{user.nombre}</p>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="reservations">
        <h3>Tus reservas</h3>
        {reservas.length === 0 ? (
          <p>No tienes reservas activas.</p>
        ) : (
          reservas.map((reservation) => (
            <div key={reservation._id} className="reservation-container mb-2">
              <div className="reservation">
                <img
                  src={reservation.imagen || "../pwa/images/default-image.png"}
                  alt={reservation.spaceName}
                  className="reservation-image"
                />
                <div className="d-flex datos-reservas">
                  <h4 className="reservation-name">
                    {reservation.spaceName || "Sin nombre"}
                  </h4>
                  <p className="reservation-address">
                    {reservation.spaceAddress || "Sin dirección"},
                    {reservation.spaceCity || "Sin ciudad"}
                  </p>

                  <p className="reservation-date">
                    <img
                      src="../pwa/images/icons/calendar.svg"
                      alt="fecha de reserva"
                    />
                    {new Date(reservation.date).toLocaleDateString("es-ES")}
                  </p>
                  <p className="reservation-date">
                    <img
                      src="../pwa/images/icons/clock.svg"
                      alt="hora de reserva"
                    />
                    {reservation.startTime} - {reservation.endTime}
                  </p>
                </div>
              </div>
              <button
                className="link m-0"
                onClick={() => handleShowModal(reservation._id)}
              >
                Cancelar reserva
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal Bootstrap */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Confirmar cancelación
                </h5>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que deseas cancelar esta reserva?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleCancelReservation(reservationToCancel);
                    handleCloseModal();
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="my-account">
        <button className="btn-primary" onClick={handleReserveNewSpace}>
          Reservar nuevo espacio
        </button>

        <button className="link text-center" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default MyAccount;
