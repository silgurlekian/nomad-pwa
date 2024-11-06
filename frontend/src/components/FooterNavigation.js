import React from "react";
import { FaHome, FaSearch, FaHeart, FaUser } from "react-icons/fa";

import './FooterNavigation.css';

function FooterNavigation() {
  return (
    <nav className="footer-navigation p-3 d-flex justify-content-around">
      <FaHome />
      <FaSearch />
      <FaHeart />
      <FaUser />
    </nav>
  );
}

export default FooterNavigation;
