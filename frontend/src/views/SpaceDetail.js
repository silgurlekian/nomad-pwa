import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderSection from "../components/HeaderSection";
import Navbar from "../components/Navbar";
import "../App.css";
import "./SpaceDetail.css";

const SpaceDetail = () => {
  const { id } = useParams();
  const [espacio, setEspacio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const iconosServicios = {
    Wifi: "../images/icons/wifi.svg",
    Impresora: "../images/icons/printer.svg",
    "Café gratis": "../images/icons/coffee.svg",
    "Excelente ubicación": "../images/icons/location.svg",
  };

  useEffect(() => {
    // Fetch del espacio con servicios ya populados
    fetch(`https://api-nomad.onrender.com/api/spaces/${id}`)
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

  if (cargando) {
    return <div>Cargando espacio...</div>;
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
              ? `https://api-nomad.onrender.com/${espacio.imagen}`
              : "default-image.png"
          }
          alt={espacio.nombre}
        />
      </div>

      <div className="contenido-detalle">
        <h1 className="h4">{espacio.nombre}</h1>

        <p className="p-title">Sobre el espacio</p>
        <div className="d-flex align-items-start">
          <img className="icono" alt="" src="images/icons/location.svg" />
          <div className="direccion-ubicacion">
            {espacio.direccion}, {espacio.ciudad}
          </div>
        </div>

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
                      src="../images/icons/verify.svg"
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
      </div>
      <Navbar />
    </div>
  );
};

export default SpaceDetail;
