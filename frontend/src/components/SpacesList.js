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

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;

    const stars = [];

    // Agregar estrellas llenas
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <img
          key={`filled-${i}`}
          className="icon"
          alt="filled-star"
          src="icons/star-filled.svg"
        />
      );
    }

    // Agregar estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <img
          key={`empty-${i}`}
          className="icon"
          alt="empty-star"
          src="icons/star.svg"
        />
      );
    }

    return stars;
  };

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
              alt={space.name}
              src={
                space.imageUrl
                  ? `http://localhost:3000${space.imageUrl}`
                  : "default-image.png"
              }
            />
          </div>
          <div className="frame1">
            <div className="frame2">
              <div className="osaka-luxury-suites">{space.name}</div>
              <div className="icon-parent">
                <img className="icon" alt="" src="icons/location.svg" />
                <div className="traditional-district">{space.address}</div>
              </div>
            </div>
            <div className="frame3">
              <div className="rating-parent">
                <div className="rating">{renderStars(space.rating)}</div>
                <div className="espacios-cercanos">{space.rating}</div>
              </div>
              <div className="d-flex align-items-center">
                <p className="price">{space.price}</p>
                <p className="currency ml-1">ARS</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SpacesList;
