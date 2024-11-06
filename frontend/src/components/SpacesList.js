import React from "react";

const spaces = [
  { name: "Roof126 - Coworking", address: "San Carlos de Bariloche", price: 870, rating: 4.0 },
  { name: "La Compañía Coworking", address: "San Carlos de Bariloche", price: 250, rating: 3.5 },
  { name: "Open Work Bariloche", address: "San Carlos de Bariloche", price: 300, rating: 4.9 },
];

function SpacesList() {
  return (
    <div className="spaces-list p-3">
      {spaces.map((space, index) => (
        <div key={index} className="card mb-3">
          <img src={`${space.name.toLowerCase().replace(/ /g, "-")}.jpg`} className="card-img-top" alt={space.name} />
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
