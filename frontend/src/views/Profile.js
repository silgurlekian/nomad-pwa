import React from "react";
import "./Profile.css";
import HeaderSection from "../components/HeaderSection";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // Si no hay datos del usuario, mostrar un mensaje
  if (!storedUser) {
    return (
      <div className="my-account">
        <HeaderSection />
        <h2>Acceso Denegado</h2>
        <p>Debes iniciar sesión para acceder a esta página.</p>
        <button onClick={() => navigate("/login")} className="login-button">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  const user = storedUser;

  const reservations = [
    {
      id: 1,
      location: "Open Work Bariloche",
      address:
        "Francisco Pascasio Moreno 370, San Carlos de Bariloche, Río Negro",
      date: "06/11/24",
      time: "10:00 - 16:30",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <HeaderSection />

      <div className="my-account">
        <h2>Mi cuenta</h2>
        <div className="user-info">
          <p>
            <strong>{user.nombre}</strong>
          </p>
          <p>{user.email}</p>
          <p>Miembro desde {user.memberSince || "Desconocido"}</p>
          <button className="edit-profile-button">Editar perfil</button>
        </div>

        <h3>Tus reservas</h3>
        <div className="reservations">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation">
              <h4>{reservation.location}</h4>
              <p>{reservation.address}</p>
              <p>
                {reservation.date} {reservation.time}
              </p>
              <button className="cancel-reservation-button">
                Cancelar reserva
              </button>
            </div>
          ))}
        </div>

        <button className="reserve-new-space-button">
          Reservar nuevo espacio
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
