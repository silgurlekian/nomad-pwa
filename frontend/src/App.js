import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Onboarding from "./views/Onboarding";
import Register from "./components/Register";
import Login from "./components/Login";
import RequestResetPassword from "./components/RequestResetPassword";
import ResetPassword from "./components/ResetPassword";
import Reservation from "./views/Reservation";
import Favorites from "./views/Favorites";

import Home from "./components/Home";
import SpacesList from "./views/SpacesList";
import SpaceDetail from "./views/SpaceDetail";
import Profile from "./views/Profile";

import SuccessPage from "./components/SuccessPage";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  // Función para activar el modo pantalla completa
  const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
      document.documentElement.msRequestFullscreen();
    }
  };

  useEffect(() => {
    const isRootPath =
      location.pathname === "/" || location.pathname === "/pwa/";

    if (isRootPath) {
      enterFullScreen(); // Forzar pantalla completa cuando estamos en la ruta raíz

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location]);

  return (
    <div className="App">
      {showSplash ? (
        <div className="splash-screen">
          <img src="./pwa/favicon.png" alt="Logo" className="logo" />
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<RequestResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/spaces" element={<SpacesList />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation-success" element={<SuccessPage />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router basename="/pwa">
      <App />
    </Router>
  );
}
