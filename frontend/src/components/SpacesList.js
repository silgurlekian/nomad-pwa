import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SpacesList.css";

function SpacesList() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/spaces")
      .then((response) => {
        setSpaces(response.data);
        setLoading(false); // Cargar los espacios y desactivar el estado de carga
      })
      .catch((error) => {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setLoading(false); // Desactivar estado de carga incluso si ocurre un error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="spaces-list">
      {spaces.map((space) => (
        <div key={space._id} className="card">
          {/* <div className="favorite-icon">
            <img src="/icons/heart.svg" alt="Ubicación" />
          </div> */}
          <img src={space.imageUrl} className="card-img-top" alt={space.name} />
          <div className="card-body">
            <h5 className="card-title">{space.name}</h5>
            <p className="card-text">
              <img src="/icons/location.svg" alt="Ubicación" /> {space.address}
            </p>
            <p className="card-text">Rating: {space.rating} ★</p>
            <p className="card-text fw-bold">${space.price} ARS</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpacesList;
