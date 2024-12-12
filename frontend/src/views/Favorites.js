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
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const response = await axios.get(
          "https://nomad-j3w6.onrender.com/api/favorites",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data;

        const favoritesWithDetails = await Promise.all(
          data.map(async (favorite) => {
            try {
              const spaceResponse = await axios.get(
                `https://nomad-j3w6.onrender.com/api/spaces/${favorite.spaceId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return { ...favorite, ...spaceResponse.data };
            } catch (spaceError) {
              console.error(
                `Error al obtener datos del espacio ${favorite.spaceId}:`,
                spaceError
              );
              return favorite; // Devuelve favorito sin detalles si falla
            }
          })
        );

        setFavorites(favoritesWithDetails);
        setCargando(false);
      } catch (mainError) {
        console.error("Error al cargar favoritos:", mainError);
        setError("No se pudieron cargar los favoritos. Intenta de nuevo.");
        setCargando(false);
      }
    };

    if (storedUser) {
      getFavorites();
    } else {
      navigate("/login");
    }
  }, [storedUser, navigate]);

  const handleClick = (space) => {
    navigate(`/spaces/${space._id}`, { state: { space } });
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Favorite ID to delete:", favoriteId); // Verifica el ID aquí
      const response = await axios.delete(
        `https://nomad-j3w6.onrender.com/api/favorites/${favoriteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delete response:", response); // Log de respuesta para verificar el éxito
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

      <div className="favorites">
        {favorites.length === 0 ? (
          <p>No tienes favoritos aún.</p>
        ) : (
          <div className="espacios-favoritos">
            {favorites.map((favorite) => {
              return (
                <div
                  key={favorite._id}
                  className="favorite-container"
                  onClick={() => handleClick(favorite)}
                >
                  <div className="favorite">
                    <img
                      className="favorite-image"
                      alt={favorite.nombre || "Nombre no disponible"}
                      src={
                        favorite.imagen
                          ? `https://nomad-j3w6.onrender.com/${favorite.imagen}`
                          : "default-image.png"
                      }
                    />
                  </div>
                  <div className="d-flex datos-favoritos">
                    <h3 className="favorite-name">
                      {favorite.nombre || "Sin nombre"}
                    </h3>
                    <div className="favorite-address">
                      <img
                        src="../pwa/images/icons/location.svg"
                        alt="direccion del espacio"
                      />
                      {favorite.direccion || "Sin dirección"},{" "}
                      {favorite.ciudad || "Sin ciudad"}
                    </div>
                    <div className="precio">
                      ${favorite.precio || "N/A"} <span>/hora</span>
                    </div>
                    <div>
                      <button
                        className="link m-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(favorite._id);
                        }}
                      >
                        Eliminar de favoritos
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Favorites;
