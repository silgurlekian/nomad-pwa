import React, { useState, useEffect } from "react";
import "../App.css";
import "./Profile.css";
import HeaderSection from "../components/HeaderSection";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const MyAccount = () => {
  const [cargando, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const getSpaces = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      }
    };

    getSpaces();
  }, []); 

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

  const reservations = [
    {
      id: 1,
      imagen: "../pwa/images/default-image.png",
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
    navigate("/login");
  };

  const getMemberSinceYear = () => {
    if (user.createdAt) {
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
      <HeaderSection title="Mi cuenta" />

      <div className="my-account">
        <div className="user-info">
          <p>{user.nombre}</p>
          <p>{user.email}</p>
          <p className="font-small">Miembro desde {getMemberSinceYear()}</p>
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
