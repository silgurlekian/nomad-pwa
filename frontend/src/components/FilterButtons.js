import React from "react";
import './FilterButtons.css';

const filters = ["Coworking", "Cafeterías", "WiFi", "24 horas", "Cercanos", "Populares"];

function FilterButtons() {
  return (
    <div className="filter-buttons p-3 d-flex flex-wrap">
      {filters.map((filter, index) => (
        <button key={index} className="btn btn-outline-secondary m-1">
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
