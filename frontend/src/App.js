import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from "./views/Onboarding";
import Register from './components/Register';
import Login from './components/Login'; 
import Home from './components/Home';
import SpacesList from './views/SpacesList'; 

function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya completó el onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (hasCompletedOnboarding) {
      setShowLogo(false); // No mostrar el logo si ya se completó el onboarding
      return; // Salir si ya se completó
    }

    // Siempre mostrar la animación al inicio
    const logoTimeout = setTimeout(() => {
      setStartAnimation(true); 
    }, 1000);

    const timer = setTimeout(() => {
      setShowLogo(false);
      localStorage.setItem('hasCompletedOnboarding', 'true'); // Marcar como completado
    }, 4000); // Asegúrate de que este tiempo sea mayor que la duración de la animación

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {showLogo ? (
          <div className={`logo-animation ${startAnimation ? 'start' : ''}`}>
            <img src="./favicon.svg" alt="Logo" className="logo" />
          </div>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/spaces" element={<SpacesList />} /> 
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;