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
import RequestResetPassword from './components/RequestResetPassword'; 
import ResetPassword from './components/ResetPassword';
import Reservation from "./views/Reservation"; // Add this import

import Home from "./components/Home";
import SpacesList from "./views/SpacesList";
import SpaceDetail from "./views/SpaceDetail";
import Profile from "./views/Profile";

import SuccessPage from "./components/SuccessPage";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Solo mostrar el splash screen en la ruta raíz
    if (location.pathname === "/") {
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
          <img src="./favicon.png" alt="Logo" className="logo" />
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

        </Routes>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}