import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from "./views/Onboarding";
import Home from './components/Home';
import SpacesList from './views/SpacesList'; 

function App() {
  const [showLogo, setShowLogo] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const logoTimeout = setTimeout(() => {
      setStartAnimation(true); 
    }, 1000);

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
          <>
            <Routes>
              <Route path="/" element={<Onboarding />} />
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