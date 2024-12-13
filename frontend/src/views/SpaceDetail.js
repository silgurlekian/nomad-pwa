import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HeaderSection from "../components/HeaderSection";
import SpaceNavbar from "../components/SpaceNavbar";
import Loading from "../components/Loading";
import "../App.css";
import "./SpaceDetail.css";

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para redirigir al usuario
  const [espacio, setEspacio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false); // Estado para verificar si el usuario está logueado

  const iconosServicios = {
    Wifi: "../pwa/images/icons/wifi.svg",
    Impresora: "../pwa/images/icons/printer.svg",
    "Café gratis": "../pwa/images/icons/coffee.svg",
    "Excelente ubicación": "../pwa/images/icons/location.svg",
  };

  const tipoReservaMap = {
    porHora: "Por hora",
    porDia: "Por día",
    porMes: "Por mes",
    porAno: "Por año",
  };

  // Simulación de verificación de usuario logueado, puedes reemplazar esto con la lógica real
  useEffect(() => {
    // Simular que el usuario está logueado, puedes reemplazarlo con la autenticación real
    const isLoggedIn = localStorage.getItem("userToken");
    setUsuarioLogueado(isLoggedIn ? true : false);

    fetch(`https://nomad-vzpq.onrender.com/api/spaces/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEspacio(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        setError(error.message);
        setCargando(false);
      });
  }, [id]);

  const handleReservaClick = () => {
    if (usuarioLogueado) {
      navigate(`/reserva/${id}`, {
        state: { spaceDetails: espacio },
      });
    } else {
      navigate("/login", {
        state: {
          from: `/reserva/${id}`,
          spaceDetails: espacio,
        },
      });
    }
  };

  if (cargando) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!espacio) {
    return <div>Espacio no encontrado</div>;
  }

  return (
    <div className="section detalle-espacio">
      <HeaderSection title="Detalle" />

      <div className="imagen-detalle">
        <img
          src={
            espacio.imagen
              ? `https://nomad-vzpq.onrender.com/${espacio.imagen}`
              : "default-image.png"
          }
          alt={espacio.nombre}
          className="imagen-espacio"
        />

        <div className="tag-container">
          <img src="../pwa/images/icons/building-4.svg" alt="tipo de espacio" />
          {espacio.spacesType && espacio.spacesType.length > 0 ? (
            <span className="tag">{espacio.spacesType[0].name}</span>
          ) : (
            <span className="tag">Tipo no disponible</span>
          )}
        </div>
      </div>

      <div className="contenido-detalle">
        <h1 className="h4">{espacio.nombre}</h1>

        <p className="p-title">Sobre el espacio</p>
        <div className="d-flex align-items-start">
          <img
            className="icono"
            alt=""
            src="../pwa/images/icons/location.svg"
          />
          <div>
            {espacio.direccion}, {espacio.ciudad}
          </div>
        </div>

        {espacio.website && (
          <p className="website">
            <Link
              to={espacio.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="icono"
                alt=""
                src="../pwa/images/icons/global-search.svg"
              />
              Visitar sitio web
            </Link>
          </p>
        )}

        {espacio.aceptaReservas ? (
          <p className="reservas">
            Acepta reservas:{" "}
            {espacio.tiposReservas
              .map((tipo) => tipoReservaMap[tipo] || tipo)
              .join(", ") || "No especificado"}
          </p>
        ) : (
          <p className="reservas">No acepta reservas</p>
        )}

        <p className="p-title">Características e Instalaciones</p>

        <ul className="services-list">
          {espacio.servicios && espacio.servicios.length > 0 ? (
            espacio.servicios.map((servicio) => (
              <li key={servicio._id}>
                {iconosServicios[servicio.name] ? (
                  <img
                    src={iconosServicios[servicio.name]}
                    alt={`${servicio.name} icon`}
                    className="service-icon"
                  />
                ) : (
                  <span className="icon-placeholder">
                    <img
                      src="../pwa/images/icons/verify.svg"
                      alt={`${servicio.name} icon`}
                      className="service-icon"
                    />
                  </span>
                )}
                {servicio.name}
              </li>
            ))
          ) : (
            <li>No hay servicios disponibles para este espacio.</li>
          )}
        </ul>

        <p className="p-title">Ubicación</p>
        <iframe
          title="Mapa"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            espacio.direccion
          )}&output=embed`}
          width="100%"
          height="200"
          style={{ border: "0" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>

        {/* Eliminar el botón de reserva si el usuario no está logueado */}
        {usuarioLogueado && (
          <button className="btn-reservar" onClick={handleReservaClick}>
            Realizar reserva
          </button>
        )}
      </div>

      <SpaceNavbar precio={espacio.precio} spaceDetails={espacio} />
    </div>
  );
};

export default SpaceDetail;
