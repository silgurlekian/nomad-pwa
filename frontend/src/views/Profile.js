import React from "react";
import "./Profile.css";
import HeaderSection from "../components/HeaderSection";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      imagen: "../images/default-image.png",
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

  const getMemberSinceYear = () => {
    if (user.createdAt) {
      console.log(user.createdAt);
      const year = new Date(user.createdAt).getFullYear();
      return isNaN(year) ? "Desconocido" : year;
    }
    return "Desconocido";
  };

  const handleReserveNewSpace = () => {
    navigate("/home");
  };

  return (
    <div>
      <HeaderSection />

      <div className="my-account">
        <div className="user-info">
          <p>{user.nombre}</p>
          <p>{user.email}</p>
          <p className="font-small">Miembro desde {getMemberSinceYear()}</p>
          {/* <button className="mt-4">Editar perfil</button> */}
        </div>
      </div>
      <div className="reservations">
        <h3>Tus reservas</h3>
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-container">
            <div className="reservation">
              <img src={reservation.imagen} alt="" />
              <div className="d-flex datos-reservas">
                <h4>{reservation.location}</h4>
                <p>{reservation.address}</p>
                <p>
                  {reservation.date} {reservation.time}
                </p>
              </div>
            </div>
            <button className="link m-0">Cancelar reserva</button>
          </div>
        ))}
      </div>
      <div className="my-account">
        <button className="reserve-button" onClick={handleReserveNewSpace}>
          Reservar nuevo espacio
        </button>

        <button
          className="link text-center logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default MyAccount;
