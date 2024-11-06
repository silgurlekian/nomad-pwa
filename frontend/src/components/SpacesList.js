import React, { useEffect, useState } from "react";
import axios from "axios";

function SpacesList() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/spaces")
      .then((response) => {
        setSpaces(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los espacios de coworking:", error);
      });
  }, []);

  return (
    <div className="spaces-list p-3">
      {spaces.map((space) => (
        <div key={space._id} className="card mb-3">
          <img src={space.imageUrl} className="card-img-top" alt={space.name} />
          <div className="card-body">
            <h5 className="card-title">{space.name}</h5>
            <p className="card-text">{space.address}</p>
            <p className="card-text">Rating: {space.rating} ★</p>
            <p className="card-text fw-bold">${space.price} ARS</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SpacesList;
