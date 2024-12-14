import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import "./SpacesList.css";

const SpacesList = () => {
  const [espacios, setSpaces] = useState([]);
  const [espaciosFiltrados, setSpacesFiltered] = useState([]);
  const [terminoBusqueda, setSearchTerms] = useState("");
  const [orderCriteria, setOrderCriteria] = useState("alfabetico");
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [ubicacionDetectada, setUbicacionDetectada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [mostrarCancelarUbicacion, setMostrarCancelarUbicacion] =
    useState(false);

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    tipos: [],
    precioMin: 0,
    precioMax: 1000,
  });
  const [tipoEspaciosFiltros, setTipoEspaciosFiltros] = useState([]);
  const [filtrosPrecio, setFiltrosPrecio] = useState({
    min: 0,
    max: 1000,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClick = (espacio) => {
    navigate(`/spaces/${espacio._id}`, { state: { espacio } });
  };

  const solicitarPermisoUbicacion = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no soportada por este navegador."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=b199cfdf173b45c6984a3a0e96040627`
            );
            const ciudad =
              response.data.results[0].components.city ||
              response.data.results[0].components.town ||
              response.data.results[0].components.village ||
              response.data.results[0].components.county;
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
  }, []);

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
      const favoritosUsuario = await axios.get(
        "https://nomad-vzpq.onrender.com/api/favorites/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const favoriteToDelete = favoritosUsuario.data.find(
        (fav) => fav.spaceId._id === espacioId
      );
      if (favoriteToDelete) {
        await axios.delete(
          `https://nomad-vzpq.onrender.com/api/favorites/${favoriteToDelete._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  const aplicarFiltrosYOrden = useCallback(
    (espacios, filtros, ordenamiento, busqueda) => {
      let filteredSpaces = [...espacios];

      if (busqueda) {
        const palabrasBusqueda = busqueda
          .toLowerCase()
          .split(/\s+/)
          .filter((palabra) => palabra.length > 0);

        filteredSpaces = filteredSpaces.filter((espacio) =>
          palabrasBusqueda.every(
            (palabra) =>
              espacio.nombre.toLowerCase().includes(palabra) ||
              espacio.direccion.toLowerCase().includes(palabra) ||
              espacio.ciudad.toLowerCase().includes(palabra)
          )
        );
      }

      if (filtros.tipos.length > 0) {
        filteredSpaces = filteredSpaces.filter((espacio) =>
          espacio.spacesType.some((tipo) => filtros.tipos.includes(tipo.name))
        );
      }

      filteredSpaces = filteredSpaces.filter(
        (espacio) =>
          espacio.precio >= filtros.precioMin &&
          espacio.precio <= filtros.precioMax
      );

      if (ordenamiento === "alfabetico") {
        filteredSpaces.sort((a, b) => a.nombre.localeCompare(b.nombre));
      } else if (ordenamiento === "precio") {
        filteredSpaces.sort((a, b) => a.precio - b.precio);
      }

      return filteredSpaces;
    },
    []
  );

  useEffect(() => {
    const getSpaces = async () => {
      try {
        const respuesta = await axios.get(
          "https://nomad-vzpq.onrender.com/api/spaces"
        );
        const espaciosData = respuesta.data;

        setSpaces(espaciosData);

        try {
          const ciudadDetectada = await solicitarPermisoUbicacion();
          const espaciosCiudad = espaciosData.filter((espacio) =>
            espacio.ciudad.toLowerCase().includes(ciudadDetectada.toLowerCase())
          );

          setSpacesFiltered(
            espaciosCiudad.length > 0 ? espaciosCiudad : espaciosData
          );
        } catch (locationError) {
          setSpacesFiltered(espaciosData);
          console.warn("No se pudo detectar la ubicación automáticamente.");
        }

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

        const tiposUnicos = [
          ...new Set(
            espaciosData
              .flatMap((espacio) => espacio.spacesType)
              .filter((tipo) => tipo)
              .map((tipo) => tipo.name)
          ),
        ];
        setTipoEspaciosFiltros(tiposUnicos);

        const precios = espaciosData.map((espacio) => espacio.precio);
        setFiltrosPrecio({
          min: Math.floor(Math.min(...precios)),
          max: Math.ceil(Math.max(...precios)),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setLoading(false);
      }
    };

    getSpaces();
  }, [user, token, solicitarPermisoUbicacion]);

  const ChangeSearch = (event) => {
    const valor = event.target.value;
    setSearchTerms(valor);

    // Si el campo de búsqueda está vacío, limpiar la ubicación detectada
    if (valor === "") {
      setUbicacionDetectada(null);
    }

    const espaciosFiltradosPorBusqueda = aplicarFiltrosYOrden(
      espacios,
      filtrosAplicados,
      orderCriteria,
      valor
    );
    setSpacesFiltered(espaciosFiltradosPorBusqueda);
  };

  const ChageOrder = (nuevoCriterio) => {
    setOrderCriteria(nuevoCriterio);

    const espaciosFiltradosPorOrden = aplicarFiltrosYOrden(
      espacios,
      filtrosAplicados,
      nuevoCriterio,
      terminoBusqueda
    );
    setSpacesFiltered(espaciosFiltradosPorOrden);
    setModalVisible(false);
  };

  const aplicarFiltros = () => {
    const espaciosFiltradosActualizados = aplicarFiltrosYOrden(
      espacios,
      filtrosAplicados,
      orderCriteria,
      terminoBusqueda
    );
    setSpacesFiltered(espaciosFiltradosActualizados);
    setFiltersModalVisible(false);
  };

  const limpiarFiltros = () => {
    setFiltrosAplicados({
      tipos: [],
      precioMin: 0,
      precioMax: 1000,
    });
    setSpacesFiltered(espacios);
  };

  const handleTipoEspacioToggle = (tipo) => {
    setFiltrosAplicados((prev) => {
      const nuevosTipos = prev.tipos.includes(tipo)
        ? prev.tipos.filter((t) => t !== tipo)
        : [...prev.tipos, tipo];

      const espaciosFiltradosActualizados = aplicarFiltrosYOrden(
        espacios,
        { ...prev, tipos: nuevosTipos },
        orderCriteria
      );

      setSpacesFiltered(espaciosFiltradosActualizados);

      return { ...prev, tipos: nuevosTipos };
    });
  };

  const FiltersModal = () => (
    <div className={`drawer ${filtersModalVisible ? "modal-visible" : ""}`}>
      <div className="modal-contenido">
        <img
          src="/pwa/images/icons/close-circle.svg"
          alt="Cerrar"
          onClick={() => setFiltersModalVisible(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
        />
        <h3>Filtros</h3>

        <div className="filtro-seccion">
          <h4>Tipo de Espacio</h4>
          {tipoEspaciosFiltros.map((tipo) => (
            <div key={tipo} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`tipo-${tipo}`}
                checked={filtrosAplicados.tipos.includes(tipo)}
                onChange={() => handleTipoEspacioToggle(tipo)}
              />
              <label className="form-check-label" htmlFor={`tipo-${tipo}`}>
                {tipo}
              </label>
            </div>
          ))}
        </div>

        <div className="filtro-seccion">
          <h4>Precio por Hora</h4>
          <div className="rango-precio">
            <div className="d-flex justify-content-between mb-2">
              <span>${filtrosAplicados.precioMin}</span>
              <span>${filtrosAplicados.precioMax}</span>
            </div>
            <input
              type="range"
              className="form-range"
              min={filtrosPrecio.min}
              max={filtrosPrecio.max}
              value={filtrosAplicados.precioMin}
              onChange={(e) =>
                setFiltrosAplicados((prev) => ({
                  ...prev,
                  precioMin: Number(e.target.value),
                }))
              }
            />
            <input
              type="range"
              className="form-range"
              min={filtrosPrecio.min}
              max={filtrosPrecio.max}
              value={filtrosAplicados.precioMax}
              onChange={(e) =>
                setFiltrosAplicados((prev) => ({
                  ...prev,
                  precioMax: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <button onClick={aplicarFiltros}>Aplicar filtros</button>
        <button onClick={limpiarFiltros}>Limpiar filtros</button>
      </div>
    </div>
  );

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

      <span className="d-none">{orderCriteria}</span>

      <div className="d-flex gap-4">
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

        <div className="iconos-ordenar-filtrar">
          <img
            src="/pwa/images/icons/setting-4.svg"
            alt="Filtrar"
            onClick={() => setFiltersModalVisible(true)}
            className="icono-ordenar"
            style={{ cursor: "pointer" }}
          />
          <span
            onClick={() => setFiltersModalVisible(true)}
            className="texto-ordenar"
            style={{ cursor: "pointer", marginLeft: "8px" }}
          >
            Filtrar
          </span>
        </div>
      </div>
      {modalVisible && (
        <div className="overlay" onClick={() => setModalVisible(false)}></div>
      )}

      {/* Nuevo modal de filtros */}
      {filtersModalVisible && (
        <div
          className="overlay"
          onClick={() => setFiltersModalVisible(false)}
        ></div>
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

      <FiltersModal />

      <div>
        {ubicacionDetectada && terminoBusqueda && (
          <p>Mostrando espacios cerca de {ubicacionDetectada}</p>
        )}
      </div>

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
