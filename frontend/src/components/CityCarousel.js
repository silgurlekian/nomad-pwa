import React from "react";
import './CityCarousel.css';

const cities = ["Bali", "Jakarta", "Semarang", "Yogyakarta"];

function CityCarousel() {
  return (
    <div className="city-carousel p-3 d-flex overflow-auto">
      {cities.map((city, index) => (
        <div key={index} className="city-thumbnail text-center m-1">
          <img src={`${city.toLowerCase()}.jpg`} alt={city} className="rounded-circle" width="50" />
          <p className="small">{city}</p>
        </div>
      ))}
    </div>
  );
}

export default CityCarousel;
