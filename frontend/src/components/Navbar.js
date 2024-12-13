import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar fixed-bottom">
      <div className="navbar-content">
        <Link to="/home" className={`nav-item ${isActive('/home') ? 'nav-active' : ''}`}>
          {isActive('/home') && <div className="active-line"></div>}
          <img src="/pwa/images/icons/home-2.svg" alt="Inicio" className="nav-icon" />
          <span>Inicio</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${isActive('/favorites') ? 'nav-active' : ''}`}>
          {isActive('/favorites') && <div className="active-line"></div>}
          <img src="/pwa/images/icons/heart.svg" alt="Favoritos" className="nav-icon" />
          <span>Favoritos</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'nav-active' : ''}`}>
          {isActive('/profile') && <div className="active-line"></div>}
          <img src="/pwa/images/icons/profile-circle.svg" alt="Mi cuenta" className="nav-icon" />
          <span>Mi cuenta</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
