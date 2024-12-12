import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderSection from "../components/HeaderSection";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "../App.css";
import "./Favorites.css";

const Favorites = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [favorites, setFavorites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getFavorites = async () => {
      if (!storedUser) return; 

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://api-nomad.onrender.com/api/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
        setError("No se pudieron cargar los favoritos.");
        setCargando(false);
      }
    };

    if (storedUser) {
      getFavorites();
    } else {
      setCargando(false);
    }
  }, [storedUser]); 

  const handleClick = (espacio) => {
    navigate(`/spaces/${espacio._id}`, { state: { espacio } });
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://api-nomad.onrender.com/api/favorites/${favoriteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response); // Log the response from the server for debugging
      setFavorites(favorites.filter((favorite) => favorite._id !== favoriteId));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      setError(
        `No se pudo eliminar el favorito: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  if (!storedUser) {
    return (
      <div>
        <HeaderSection />
        <div className="my-account text-center">
          <img
            src="../pwa/images/icons/warning-big.svg"
            alt=""
            className="warning-icon"
          />
          <p>Debes iniciar sesión para acceder a esta página.</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (cargando) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <HeaderSection title="Mis favoritos" />

      <div className="favoritos">
        <h2>Mis Favoritos</h2>

        {favorites.length === 0 ? (
          <p>No tienes favoritos aún.</p>
        ) : (
          <div className="espacios-favoritos">
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="espacio"
                onClick={() => handleClick(favorite.espacioId)} // Cambié espacioId por el valor correcto
              >
                <div className="marco-imagen">
                  <img
                    className="imagen-espacio-lista"
                    alt={favorite.espacioId.nombre}
                    src={
                      favorite.espacioId.imagen
                        ? `https://api-nomad.onrender.com/${favorite.espacioId.imagen}`
                        : "default-image.png" // Usar una imagen por defecto si no hay imagen
                    }
                  />
                </div>
                <div className="contenido-espacio">
                  <h3 className="nombre-espacio">
                    {favorite.espacioId.nombre}
                  </h3>
                  <div className="direccion">
                    <img
                      src="../pwa/images/icons/location.svg"
                      alt="direccion del espacio"
                    />
                    {favorite.espacioId.direccion}, {favorite.espacioId.ciudad}
                  </div>
                  <div className="precio mt-3">
                    ${favorite.espacioId.precio} <span>/hora</span>
                  </div>
                  <div>
                    <button
                      className="eliminar-favorito"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic sobre el botón active el evento onClick del contenedor
                        handleRemoveFavorite(favorite._id);
                      }}
                    >
                      Eliminar de favoritos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Favorites;
