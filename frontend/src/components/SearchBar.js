import React from "react";
import { FaSearch } from "react-icons/fa";

import './SearchBar.css';

function SearchBar() {
  return (
    <div className="search-bar p-3">
      <input type="text" className="form-control" placeholder="Buscar espacios, ciudades..." />
      <button className="btn btn-primary ms-2">
        <FaSearch />
      </button>
    </div>
  );
}

export default SearchBar;
