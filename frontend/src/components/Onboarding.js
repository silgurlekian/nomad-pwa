import React, { useState, useEffect } from "react";
import "./Onboarding.css";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const slides = [
    {
      image: "./images/onboarding1.jpg",
      title: "Bienvenido a nomad!",
      description:
        "Encuentra el espacio de trabajo perfecto cerca tuyo. Ya sea para una reunión rápida o un día de trabajo remoto, tenemos el lugar que necesitas.",
    },
    {
      image: "./images/onboarding2.jpg",
      title: "Explora espacios de trabajo",
      description:
        "Descubre coworkings, cafés y oficinas en toda la ciudad. Filtra por ubicación, servicios y más para encontrar el espacio ideal para trabajar.",
    },
    {
      image: "./images/onboarding3.jpg",
      title: "Reserva tu espacio de trabajo en segundos",
      description:
        "Navega, elige y confirma tu lugar ideal para trabajar sin complicaciones.",
    },
  ];

  const nextSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSkip = () => {
    navigate("/home");
  };

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div className="onboarding">
      <img
        className="image-onboarding"
        alt=""
        src={slides[currentSlide].image}
      />
      <div className="text">
        <b className="title-onboarding">{slides[currentSlide].title}</b>
        <div className="subtitle-onboarding">
          {slides[currentSlide].description}
        </div>
      </div>
      <div className="bullets-link">
        <div className="bullets">
          {slides.map((_, index) => (
            <div
              key={index}
              className={index === currentSlide ? "active" : "circle"}
              onClick={() => nextSlide(index)}
            />
          ))}
        </div>
        <div
          className="saltar"
          onClick={
            currentSlide === slides.length - 1 ? handleContinue : handleSkip
          } 
        >
          {currentSlide === slides.length - 1 ? "Continuar" : "Saltar"}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;