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
        if (!token) {
          navigate("/login");
          return;
        }

        // Obtener los favoritos del usuario
        const { data } = await axios.get(
          "https://nomad-j3w6.onrender.com/api/favorites/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Log the initial favorites response
        console.log("Initial Favorites Response:", data);

        // Directly set favorites without additional mapping
        setFavorites(data);
        setCargando(false);
      } catch (mainError) {
        console.error(
          "Detailed Error loading favorites:",
          mainError.response ? mainError.response.data : mainError.message
        );
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

  const handleRemoveFavorite = async (favoriteId, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar este favorito?"
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `https://nomad-j3w6.onrender.com/api/favorites/${favoriteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Actualizar el estado de favoritos
        setFavorites((favorites) =>
          favorites.filter((favorite) => favorite._id !== favoriteId)
        );
      } catch (error) {
        console.error(
          "Error al eliminar favorito:",
          error.response ? error.response.data : error.message
        );

        const errorMessage = error.response
          ? error.response.data.message
          : "No se pudo eliminar el favorito";

        setError(errorMessage);
      }
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
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="favorite-container"
                onClick={() => handleClick(favorite.spaceId)}
              >
                <div className="favorite">
                  <img
                    className="favorite-image"
                    alt={favorite.spaceId.nombre || "Nombre no disponible"}
                    src={
                      favorite.spaceId.imagen
                        ? `https://nomad-j3w6.onrender.com/${favorite.spaceId.imagen}`
                        : "default-image.png"
                    }
                  />
                </div>
                <div className="d-flex datos-favoritos">
                  <h3 className="favorite-name">
                    {favorite.spaceId.nombre || "Sin nombre"}
                  </h3>
                  <div className="favorite-address">
                    <img
                      src="../pwa/images/icons/location.svg"
                      alt="direccion del espacio"
                    />
                    {favorite.spaceId.direccion || "Sin dirección"},{" "}
                    {favorite.spaceId.ciudad || "Sin ciudad"}
                  </div>
                  <div className="precio">
                    ${favorite.spaceId.precio || "N/A"} <span>/hora</span>
                  </div>
                  <div>
                    <button
                      className="link m-0"
                      onClick={(e) => handleRemoveFavorite(favorite._id, e)}
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
