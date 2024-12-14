import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import "./SpacesList.css";

const SpacesList = () => {
  const [espacios, setSpaces] = useState([]);
  const [espaciosFiltrados, setSpacesFiltered] = useState([]);
  const [terminoBusqueda, setSearchTerms] = useState("");
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criterioOrdenacion, setOrderCriteria] = useState("alfabetico");
  const [modalVisible, setModalVisible] = useState(false);
  const [ubicacionDetectada, setUbicacionDetectada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [mostrarCancelarUbicacion, setMostrarCancelarUbicacion] =
    useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClick = (espacio) => {
    navigate(`/spaces/${espacio._id}`, { state: { espacio } });
  };

  const solicitarPermisoUbicacion = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada por este navegador."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const ciudad =
              response.data.address.city ||
              response.data.address.town ||
              response.data.address.village ||
              response.data.address.county;
            setUbicacionDetectada(ciudad);
            setSearchTerms(ciudad);
            setMostrarCancelarUbicacion(true);
            resolve(ciudad);
          } catch (error) {
            console.error("Error al obtener la ciudad:", error);
            reject(error);
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const cancelarUbicacion = () => {
    setSearchTerms("");
    setMostrarCancelarUbicacion(false);
    setSpacesFiltered(espacios);
  };

  const handleFavoriteToggle = async (espacioId, isFavorite) => {
    if (!user) {
      setWarningMessage("Debes estar logueado para gestionar favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(espacioId);
      } else {
        await toggleFavorite(espacioId);
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
      setWarningMessage("Hubo un problema al actualizar tus favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
    }
  };

  const toggleFavorite = async (spaceId) => {
    try {
      await axios.post(
        "https://nomad-vzpq.onrender.com/api/favorites",
        { spaceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Actualizar la lista de favoritos
      setFavoritos((prevFavoritos) => [...prevFavoritos, spaceId]);
      setSuccessMessage("Espacio añadido a favoritos.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al añadir favorito:", error);
      setWarningMessage("No se pudo añadir a favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
    }
  };

  const removeFavorite = async (espacioId) => {
    try {
      // Buscar el ID del favorito para este espacio
      const favoritosUsuario = await axios.get(
        "https://nomad-vzpq.onrender.com/api/favorites/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Encontrar el favorito específico para eliminar
      const favoriteToDelete = favoritosUsuario.data.find(
        (fav) => fav.spaceId._id === espacioId
      );
      if (favoriteToDelete) {
        await axios.delete(
          `https://nomad-vzpq.onrender.com/api/favorites/${favoriteToDelete._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Actualizar lista de favoritos
        setFavoritos((prevFavoritos) =>
          prevFavoritos.filter((id) => id !== espacioId)
        );
        setSuccessMessage("Espacio eliminado de favoritos.");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      setWarningMessage("No se pudo eliminar de favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
    }
  };

  useEffect(() => {
    const getSpaces = async () => {
      try {
        const respuesta = await axios.get(
          "https://nomad-vzpq.onrender.com/api/spaces"
        );
        setSpaces(respuesta.data);

        // Intento de detectar la ubicación cuando los espacios se cargan por primera vez
        try {
          const ciudadDetectada = await solicitarPermisoUbicacion();

          // Filtra automáticamente los espacios según la ubicación detectada
          const espaciosCiudad = respuesta.data.filter((espacio) =>
            espacio.ciudad.toLowerCase().includes(ciudadDetectada.toLowerCase())
          );

          // Si se encuentran espacios en la ciudad detectada se filtra. En caso contrario, conservar todos los espacios
          setSpacesFiltered(
            espaciosCiudad.length > 0 ? espaciosCiudad : respuesta.data
          );
        } catch (locationError) {
          // Si falla la detección de la ubicación, muestra todos los espacios
          setSpacesFiltered(respuesta.data);
          console.warn("No se pudo detectar la ubicación automáticamente.");
        }

        // Cargar favoritos del usuario
        if (user && token) {
          try {
            const responseFavs = await axios.get(
              "https://nomad-vzpq.onrender.com/api/favorites/user",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const idsFavoritos = responseFavs.data.map(
              (fav) => fav.spaceId._id
            );
            setFavoritos(idsFavoritos);
          } catch (errorFavs) {
            console.error("Error al cargar los favoritos:", errorFavs);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setLoading(false);
      }
    };

    getSpaces();
  }, [user, token]);

  const ChangeSearch = (event) => {
    const valor = event.target.value.toLowerCase();
    setSearchTerms(valor);

    // Safely handle location detection comparison
    const detectedLocationLower = ubicacionDetectada?.toLowerCase() || "";

    // Si se modifica la búsqueda, eliminar la ubicación detectada
    if (valor !== detectedLocationLower) {
      const elementoAOcultar = document.getElementById("elementoAOcultar");
      if (elementoAOcultar) {
        elementoAOcultar.style.display = "none";
      }
      setUbicacionDetectada(null);
    }

    // Actualizar visibilidad del botón de cancelar ubicación
    setMostrarCancelarUbicacion(valor !== detectedLocationLower);

    // Filter spaces based on search words
    const palabrasBusqueda = valor
      .split(/\s+/)
      .filter((palabra) => palabra.length > 0);

    const filtrados =
      palabrasBusqueda.length === 0
        ? espacios
        : espacios.filter((espacio) =>
            palabrasBusqueda.every(
              (palabra) =>
                espacio.nombre
                  .toLowerCase()
                  .split(/\s+/)
                  .some((nombrePalabra) => nombrePalabra.includes(palabra)) ||
                espacio.direccion
                  .toLowerCase()
                  .split(/\s+/)
                  .some((direccionPalabra) =>
                    direccionPalabra.includes(palabra)
                  ) ||
                espacio.ciudad
                  .toLowerCase()
                  .split(/\s+/)
                  .some((ciudadPalabra) => ciudadPalabra.includes(palabra))
            )
          );

    // Establecer espacios filtrados
    setSpacesFiltered(filtrados);
  };

  const ChageOrder = (nuevoCriterio) => {
    setOrderCriteria(nuevoCriterio);
    let ordenados;

    if (nuevoCriterio === "alfabetico") {
      ordenados = [...espaciosFiltrados].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    } else if (nuevoCriterio === "precio") {
      ordenados = [...espaciosFiltrados].sort((a, b) => a.precio - b.precio);
    }

    setSpacesFiltered(ordenados);
    setModalVisible(false);
  };

  if (cargando) return <Loading />;

  if (error) return <div>{error}</div>;

  return (
    <div className="lista-espacios">
      <div className="titulo">
        <h2>Encuentra tu próximo espacio</h2>
      </div>

      <div className="input-group mb-3" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Buscar espacios, ciudades..."
          value={terminoBusqueda}
          onChange={ChangeSearch}
          className="form-control"
          style={{
            paddingLeft: "30px",
            paddingRight: mostrarCancelarUbicacion ? "60px" : "30px",
          }}
        />
        <img
          src="/pwa/images/icons/search.svg"
          alt="Buscar"
          className="search-icon"
        />
        {mostrarCancelarUbicacion && (
          <img
            src="/pwa/images/icons/close-circle.svg"
            alt="Cancelar ubicación"
            onClick={cancelarUbicacion}
            className="close-circle"
          />
        )}
      </div>

      <span className="d-none">{criterioOrdenacion}</span>

      <div className="iconos-ordenar-filtrar">
        <img
          src="/pwa/images/icons/arrow-3.svg"
          alt="Ordenar"
          onClick={() => setModalVisible(true)}
          className="icono-ordenar"
          style={{ cursor: "pointer" }}
        />
        <span
          onClick={() => setModalVisible(true)}
          className="texto-ordenar"
          style={{ cursor: "pointer", marginLeft: "8px" }}
        >
          Ordenar
        </span>
      </div>

      {modalVisible && (
        <div className="overlay" onClick={() => setModalVisible(false)}></div>
      )}

      <div className={`drawer ${modalVisible ? "modal-visible" : ""}`}>
        <div className="modal-contenido">
          <img
            src="/pwa/images/icons/close-circle.svg"
            alt="Cerrar"
            onClick={() => setModalVisible(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}
          />
          <h3>Ordenar</h3>
          <ul className="list-unstyled">
            <li>
              <button
                className="btn btn-link"
                onClick={() => ChageOrder("alfabetico")}
              >
                Alfabéticamente
              </button>
            </li>
            <li>
              <button
                className="btn btn-link"
                onClick={() => ChageOrder("precio")}
              >
                Por precio
              </button>
            </li>
          </ul>
        </div>
      </div>

      {ubicacionDetectada ? (
        <p className="texto-ubicacion" id="elementoAOcultar">
          {" "}
          Mostrando espacios cerca de {ubicacionDetectada}
        </p>
      ) : (
        <p className="texto-ubicacion"></p>
      )}

      {espaciosFiltrados.length === 0 ? (
        <div className="alerta alerta-info">
          No se encontraron espacios que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="espacio-contenedor mb-5">
          {/* Mostrar el mensaje de éxito si existe */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {warningMessage && (
            <div className="alert alert-warning" role="alert">
              {warningMessage}
            </div>
          )}
          {espaciosFiltrados.map((espacio) => (
            <div
              key={espacio._id}
              className="espacio"
              onClick={() => handleClick(espacio)}
            >
              <div className="marco-imagen">
                <img
                  className="imagen-espacio-lista"
                  alt={espacio.nombre}
                  src={
                    espacio.imagen
                      ? `https://nomad-vzpq.onrender.com/${espacio.imagen}`
                      : "default-image.png"
                  }
                />
                <div className="tag-container">
                  <img
                    src="../pwa/images/icons/building-4.svg"
                    alt="tipo de espacio"
                  />
                  {espacio.spacesType && espacio.spacesType.length > 0 ? (
                    <span className="tag">{espacio.spacesType[0].name}</span>
                  ) : (
                    <span className="tag">Tipo no disponible</span>
                  )}
                </div>
              </div>
              <div className="contenido-espacio">
                <h3 className="nombre-espacio">{espacio.nombre}</h3>
                <div className="direccion">
                  <img
                    src="../pwa/images/icons/location.svg"
                    alt="direccion del espacio"
                  />
                  {espacio.direccion}, {espacio.ciudad}
                </div>
                <div className="d-flex align-items-center justify-content-between mt-3">
                  <div className="precio">
                    ${espacio.precio} <span>/hora</span>
                  </div>
                  <div
                    className="favorito"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleFavoriteToggle(
                        espacio._id,
                        favoritos.includes(espacio._id)
                      );
                    }}
                  >
                    <img
                      src={
                        favoritos.includes(espacio._id)
                          ? "/pwa/images/icons/heart-filled.svg"
                          : "/pwa/images/icons/heart-fav.svg"
                      }
                      alt={`Favorito ${espacio.nombre}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacesList;
