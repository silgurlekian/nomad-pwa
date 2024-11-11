import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from "./components/Onboarding";
import Home from './components/Home';

function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Mostrar el logo durante 1 segundo antes de comenzar la animación
    const logoTimeout = setTimeout(() => {
      setStartAnimation(true); // Inicia la animación después de 1 segundo
    }, 1000);

    // Después de 3 segundos ocultar el logo
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);

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
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
