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
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getReservations = async () => {
      try {
        const response = await fetch(
          "https://api-nomad.onrender.com/api/reservations/user",
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

        // Aquí se busca el nombre y dirección del espacio para cada reserva
        const reservasConDetalles = await Promise.all(
          data.map(async (reserva) => {
            const spaceResponse = await fetch(
              `https://api-nomad.onrender.com/api/spaces/${reserva.spaceId}`,
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

            return reserva; // Si no se puede obtener los detalles del espacio, devolvemos la reserva tal cual
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
        `https://api-nomad.onrender.com/api/reservations/${reservationId}`,
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
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
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
            <div key={reservation._id} className="reservation-container">
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
                onClick={() => handleCancelReservation(reservation._id)}
              >
                Cancelar reserva
              </button>
            </div>
          ))
        )}
      </div>

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
