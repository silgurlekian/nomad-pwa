import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import "./SpacesList.css";

const SpacesList = () => {
  const [espacios, setSpaces] = useState([]);
  const [espaciosFiltrados, setSpacesFiltered] = useState([]);
  const [terminoBusqueda, setSearchTerms] = useState(""); // Inicialmente vacío
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criterioOrdenacion, setOrderCriteria] = useState("alfabetico");
  const [modalVisible, setModalVisible] = useState(false);
  const [ubicacionDetectada, setUbicacionDetectada] = useState("tu ubicación");
  const [favoritos, setFavoritos] = useState([]); // Estado para gestionar los favoritos

  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  // Obtener user y token desde localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Función para solicitar permisos de ubicación
  const solicitarPermisoUbicacion = () => {
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
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const handleFavoriteToggle = async (spaceId, isFavorite) => {
    if (!user) {
      setWarningMessage("Debes estar logueado para gestionar favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(spaceId);
      } else {
        await toggleFavorite(spaceId);
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
      setWarningMessage("Hubo un problema al actualizar tus favoritos.");
      setTimeout(() => setWarningMessage(""), 3000);
    }
  };

  const toggleFavorite = async (spaceId) => {
    try {
      const response = await axios.post(
        "https://nomad-j3w6.onrender.com/api/favorites",
        {
          spaceId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavoritos((prevFavoritos) => [...prevFavoritos, response.data._id]);
      console.log("Favorito gestionado:", response.data);
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
    }
  };

  const removeFavorite = async (spaceId) => {
    try {
      await axios.delete(
        `https://nomad-j3w6.onrender.com/api/favorites/${spaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavoritos((prevFavoritos) =>
        prevFavoritos.filter((id) => id !== spaceId)
      );
      setSuccessMessage("Espacio eliminado de favoritos.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al eliminar el favorito:", error);
      setWarningMessage("Hubo un problema al eliminar el favorito.");
      setTimeout(() => setWarningMessage(""), 3000);
    }
  };

  useEffect(() => {
    const getSpaces = async () => {
      try {
        const respuesta = await axios.get(
          "https://nomad-j3w6.onrender.com/api/spaces"
        );
        setSpaces(respuesta.data);

        try {
          const ciudadDetectada = await solicitarPermisoUbicacion();
          setSearchTerms(ciudadDetectada);

          const espaciosCiudad = respuesta.data.filter((espacio) =>
            espacio.ciudad
              .toLowerCase()
              .trim()
              .includes(ciudadDetectada.toLowerCase().trim())
          );

          setSpacesFiltered(
            espaciosCiudad.length > 0 ? espaciosCiudad : respuesta.data
          );
        } catch (errorUbicacion) {
          console.error("No se pudo detectar la ubicación:", errorUbicacion);
          setSpacesFiltered(respuesta.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setLoading(false);
      }
    };

    getSpaces();
  }, []);

  const ChageSearch = (event) => {
    const valor = event.target.value.trim();
    setSearchTerms(valor);

    const filtrados = espacios.filter(
      (espacio) =>
        espacio.nombre.toLowerCase().includes(valor.toLowerCase()) ||
        espacio.direccion.toLowerCase().includes(valor.toLowerCase()) ||
        espacio.ciudad.toLowerCase().includes(valor.toLowerCase())
    );

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

  if (cargando) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          onChange={ChageSearch}
          className="form-control"
          style={{ paddingLeft: "30px" }}
        />
        <img
          src="/pwa/images/icons/search.svg"
          alt="Buscar"
          className="search-icon"
        />
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

      {ubicacionDetectada !== "tu ubicación" ? (
        <p className="texto-ubicacion">Espacios cerca de tu ubicación</p>
      ) : (
        <p className="texto-ubicacion">Resultados para tu búsqueda</p>
      )}

      {espaciosFiltrados.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron espacios para tu búsqueda.</p>
        </div>
      ) : (
        <div className="row">
          {espaciosFiltrados.map((espacio) => {
            const isFavorite = favoritos.includes(espacio._id);

            return (
              <div className="col-md-4" key={espacio._id}>
                <div className="espacio-card">
                  <div className="espacio-card-body">
                    <h3>{espacio.nombre}</h3>
                    <p>{espacio.direccion}</p>
                    <p>Ciudad: {espacio.ciudad}</p>
                    <p>Precio: ${espacio.precio}</p>

                    <button
                      onClick={() => handleFavoriteToggle(espacio._id, isFavorite)}
                      className={`btn-favorite ${isFavorite ? "favorito" : ""}`}
                    >
                      {isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {warningMessage && <div className="alert alert-warning">{warningMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
    </div>
  );
};

export default SpacesList;
