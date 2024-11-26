import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./SpacesList.css";

const SpacesList = () => {
  const [espacios, setSpaces] = useState([]);
  const [espaciosFiltrados, setSpacesFiltered] = useState([]);
  const [terminoBusqueda, setSearchTerms] = useState("");
  const [cargando, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [criterioOrdenacion, setOrderCriteria] = useState("alfabetico");
  const [modalVisible, setModalVisible] = useState(false);

  const navigate = useNavigate();

  const handleClick = (espacio) => {
    navigate(`/spaces/${espacio._id}`, { state: { espacio } });
  };

  useEffect(() => {
    const getSpaces = async () => {
      try {
        const respuesta = await axios.get(
          "http://localhost:3000/api/spaces"
        );
        setSpaces(respuesta.data);
        setSpacesFiltered(respuesta.data);
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
    const valor = event.target.value;
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
    return <div>Cargando espacios...</div>;
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
          src="images/icons/search.svg"
          alt="Buscar"
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
          }}
        />
      </div>

      <span className="d-none">{criterioOrdenacion}</span>

      <div className="iconos-ordenar-filtrar">
        <img
          src="images/icons/arrow-3.svg"
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

      {/* Overlay */}
      {modalVisible && (
        <div className="overlay" onClick={() => setModalVisible(false)}></div>
      )}

      {/* Modal */}
      <div className={`drawer ${modalVisible ? "modal-visible" : ""}`}>
        <div className="modal-contenido">
          <img
            src="images/icons/close-circle.svg"
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

      {espaciosFiltrados.length === 0 ? (
        <div className="alerta alerta-info">
          No se encontraron espacios que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="espacio-contenedor mb-5">
          {espaciosFiltrados.map((espacio) => (
            <div
              key={espacio._id}
              className="espacio"
              onClick={() => handleClick(espacio)}
            >
              <div className="marco-imagen">
                <img
                  className="imagen-espacio"
                  alt={espacio.nombre}
                  src={
                    espacio.imagen
                      ? `http://localhost:3000/${espacio.imagen}`
                      : "default-image.png"
                  }
                />
              </div>
              <div className="contenido-espacio">
                <div className="nombre-espacio">{espacio.nombre}</div>
                <div className="d-flex align-items-start">
                  <img
                    className="icono"
                    alt=""
                    src="images/icons/location.svg"
                  />
                  <div className="direccion-ubicacion">
                    {espacio.direccion}, {espacio.ciudad}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-1">
                  <p className="precio">{espacio.precio}</p>
                  <p className="moneda">ARS</p>
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
