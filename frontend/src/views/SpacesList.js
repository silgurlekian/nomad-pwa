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
  const [ubicacionObtenida, setUbicacionObtenida] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [mostrarCancelarUbicacion, setMostrarCancelarUbicacion] =
    useState(false);

  const [tipoEspaciosFiltros, setTipoEspaciosFiltros] = useState([]);
  const [filtrosPrecio, setFiltrosPrecio] = useState({
    min: 0,
    max: 1000,
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    tipos: [],
    precioMin: filtrosPrecio.min,
    precioMax: filtrosPrecio.max,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleClick = (espacio) => {
    navigate(`/spaces/${espacio._id}`, { state: { espacio } });
  };

  const solicitarPermisoUbicacion = useCallback(async () => {
    if (ubicacionObtenida) return; // Si la ubicación ya fue obtenida, no hacer nada

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
            setUbicacionObtenida(true); // Marcar que la ubicación ha sido obtenida
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
  }, [ubicacionObtenida]);

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
        // Normalizar el término de búsqueda
        const palabrasBusqueda = busqueda
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .split(/\s+/)
          .filter((palabra) => palabra.length > 0);

        filteredSpaces = filteredSpaces.filter((espacio) =>
          palabrasBusqueda.every(
            (palabra) =>
              espacio.nombre
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(palabra) ||
              espacio.direccion
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(palabra) ||
              espacio.ciudad
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .includes(palabra)
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

        // Calcular el mínimo y máximo de los precios de los espacios
        const precios = espaciosData.map((espacio) => espacio.precio);
        const precioMin = Math.floor(Math.min(...precios));
        const precioMax = Math.ceil(Math.max(...precios));

        // Establecer los filtros con el rango de precios calculado
        setFiltrosPrecio({
          min: precioMin,
          max: precioMax,
        });

        setFiltrosAplicados({
          tipos: [],
          precioMin: precioMin,
          precioMax: precioMax,
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

  // Añadir un estado que controle si el campo tiene texto
  const [mostrarBorrar, setMostrarBorrar] = useState(false);

  // Modificar la función ChangeSearch para que actualice el estado de mostrarBorrar
  const ChangeSearch = (event) => {
    const valor = event.target.value;
    setSearchTerms(valor);

    // Mostrar la cruz si el campo tiene texto
    setMostrarBorrar(valor.length > 0);

    // Si el campo de búsqueda está vacío, limpiar la ubicación detectada
    if (valor === "") {
      setUbicacionDetectada(null);
    }

    // Normalizar el valor de búsqueda eliminando acentos y caracteres especiales
    const valorNormalizado = valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const espaciosFiltradosPorBusqueda = aplicarFiltrosYOrden(
      espacios,
      filtrosAplicados,
      orderCriteria,
      valorNormalizado
    );
    setSpacesFiltered(espaciosFiltradosPorBusqueda);
  };

  // Función para limpiar el campo de búsqueda al hacer clic en la cruz
  const limpiarBusqueda = () => {
    setSearchTerms("");
    setMostrarBorrar(false);
    setSpacesFiltered(espacios);
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
      precioMin: filtrosPrecio.min,
      precioMax: filtrosPrecio.max,
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

        <div className="filtro-seccion mt-4">
          <p>
            <strong>Tipo de espacio</strong>
          </p>
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

        <div className="filtro-seccion mt-4">
          <p>
            <strong>Precio por hora</strong>
          </p>
          <div className="rango-precio">
            <div className="d-flex align-items-center gap-2 justify-content-between mb-2">
              <div className="w-100">
                <p className="m-0">Mínimo</p>
                <input
                  type="number"
                  className="form-control"
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
              </div>
              <div className="w-100">
                <p className="m-0">Máximo</p>
                <input
                  type="number"
                  className="form-control"
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
          </div>
        </div>

        <button onClick={aplicarFiltros} className="btn-primary mt-4">
          Aplicar filtros
        </button>
        <button onClick={limpiarFiltros} className="link m-0">
          Limpiar filtros
        </button>
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
          value={terminoBusqueda}
          onChange={ChangeSearch}
          placeholder="Buscar espacios"
          className="form-control campo-busqueda"
        />
        {mostrarBorrar && (
          <span className="clear-search" onClick={limpiarBusqueda}>
            <img
              src="../pwa/images/icons/close-circle.svg"
              alt=""
              className="close-circle"
            />
          </span>
        )}
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
