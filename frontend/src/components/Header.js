import React from "react";
import './Header.css';

function Header() {
  return (
    <header className="header p-3 d-flex align-items-center">
      <div className="logo">
        <h2>Bienvenido a nomad!</h2>
      </div>

      <div className="user-profile ms-3">
        {/* Puedes agregar la imagen de perfil o el ícono de notificaciones aquí */}
        {/* <img src="/images/user-profile.jpg" alt="Profile" className="rounded-circle" width="40" /> */}
        {/* <FaBell className="ms-2" /> */}
      </div>
    </header>
  );
}

export default Header;
