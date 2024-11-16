import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SpacesList.css";

const SpacesList = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/spaces")
      .then((response) => {
        setSpaces(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando espacios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="spaceslist">
      <div className="title">
        <div className="espacios-cercanos">Espacios recomendados</div>
      </div>
      {spaces.map((space) => (
        <div key={space._id} className="space">
          <div className="frame">
            <img
              className="image-icon"
              alt={space.nombre}
              src={
                space.imagen
                  ? `http://localhost:3000/${space.imagen}`
                  : "default-image.png"
              }
            />
          </div>
          <div className="frame1">
            <div className="frame2">
              <div className="osaka-luxury-suites">{space.nombre}</div>
              <div className="icon-parent">
                <img className="icon" alt="" src="icons/location.svg" />
                <div className="traditional-district">{space.direccion}, {space.ciudad}</div>
              </div>
            </div>
            <div className="frame3">
              <div className="d-flex align-items-center">
                <p className="precio">{space.precio}</p>
                <p className="currency ml-1"> ARS</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpacesList;
