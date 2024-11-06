import React from "react";
import { FaBell } from "react-icons/fa";

function Header() {
  return (
    <header className="header p-3 d-flex align-items-center">
      <div className="logo">
        <h2>Nomad</h2>
      </div>
      <div className="welcome-message ms-auto">
        <span>Bienvenido a nomad!</span>
      </div>
      <div className="user-profile ms-3">
        <img src="user-profile.jpg" alt="Profile" className="rounded-circle" width="40" />
        <FaBell className="ms-2" />
      </div>
    </header>
  );
}

export default Header;
