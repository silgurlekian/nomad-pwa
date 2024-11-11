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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="spaceslist">
      <div className="title">
        <div className="espacios-cercanos">Espacios cercanos</div>
        <div className="ver-todos">Ver todos</div>
      </div>
      {spaces.map((space) => (
        <div key={space._id} className="space">
          <div className="frame">
            <img
              className="image-icon"
              alt={space.name}
              src={
                space.imageUrl
                  ? `http://localhost:3000${space.imageUrl}`
                  : "default-image.png"
              } // Usamos la URL completa para acceder a la imagen
            />
          </div>
          <div className="frame1">
            <div className="frame2">
              <div className="osaka-luxury-suites">{space.name}</div>
              <div className="vuesaxlinearlocation-parent">
                <img
                  className="vuesaxlinearlocation-icon"
                  alt=""
                  src="icons/location.svg"
                />
                <div className="traditional-district">{space.address}</div>
              </div>
            </div>
            <div className="frame3">
              <div className="rating-parent">
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <img
                      key={index}
                      className="vuesaxlinearstar-icon"
                      alt=""
                      src="icons/star.svg"
                    />
                  ))}
                </div>
                <div className="espacios-cercanos">{space.rating}</div>
              </div>
              <div className="frame4">
                <div className="frame5">
                  <div className="vuesaxlinearcurrency-circle">
                    <img
                      className="vuesaxlinearcurrency-icon"
                      alt=""
                      src="icons/currency.svg"
                    />
                  </div>
                  <div className="price">{space.price} USD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpacesList;
