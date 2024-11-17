import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <div className="navbar fixed-bottom">
      <div className="navbar-content">
        <Link to="/spaces" className="nav-item">
          <img src="icons/home-2.svg" alt="Inicio" className="nav-icon" />
          <span>Inicio</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <img src="icons/profile-circle.svg" alt="Mi cuenta" className="nav-icon" />
          <span>Mi cuenta</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;