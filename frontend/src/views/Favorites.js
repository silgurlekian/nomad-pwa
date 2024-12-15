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
  const [showModal, setShowModal] = useState(false);
  const [favoriteToRemove, setFavoriteToRemove] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCargando(false);
          return;
        }

        // Obtener los favoritos del usuario
        const { data } = await axios.get(
          "https://nomad-znm2.onrender.com/api/favorites/user",
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
      setCargando(false); // Fin de la carga si no hay usuario
    }
  }, [storedUser, navigate]);

  const handleClick = (space) => {
    navigate(`/spaces/${space._id}`, { state: { space } });
  };

  const handleShowModal = (favoriteId) => {
    setFavoriteToRemove(favoriteId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFavoriteToRemove(null);
  };

  const handleRemoveFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://nomad-znm2.onrender.com/api/favorites/${favoriteToRemove}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites((favorites) =>
        favorites.filter((favorite) => favorite._id !== favoriteToRemove)
      );
      setShowModal(false);
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
  };

  if (!storedUser) {
    return (
      <div>
        <HeaderSection title="Favoritos" />
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
        <Navbar />
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
                        ? `https://nomad-znm2.onrender.com/${favorite.spaceId.imagen}`
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowModal(favorite._id);
                      }}
                    >
                      Eliminar favorito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Confirmar eliminación
                </h5>
              </div>
              <div className="modal-body">
                ¿Estás seguro de que deseas eliminar este favorito?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleRemoveFavorite}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Favorites;
