import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SpacesList.css";

const ListaEspacios = () => {
  const [espacios, setEspacios] = useState([]);
  const [espaciosFiltrados, setEspaciosFiltrados] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerEspacios = async () => {
      try {
        const respuesta = await axios.get("http://localhost:3000/api/spaces");
        setEspacios(respuesta.data);
        setEspaciosFiltrados(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener los espacios de coworking:", error);
        setError("No se pudieron cargar los espacios.");
        setCargando(false);
      }
    };

    obtenerEspacios();
  }, []);

  const manejarCambioBusqueda = (event) => {
    const valor = event.target.value;
    setTerminoBusqueda(valor);

    const filtrados = espacios.filter(
      (espacio) =>
        espacio.nombre.toLowerCase().includes(valor.toLowerCase()) ||
        espacio.direccion.toLowerCase().includes(valor.toLowerCase()) ||
        espacio.ciudad.toLowerCase().includes(valor.toLowerCase())
    );

    setEspaciosFiltrados(filtrados);
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
        <h2 className="espacios-recomendados">Espacios recomendados</h2>
      </div>
      <input
        type="text"
        placeholder="Buscar espacios, ciudades..."
        value={terminoBusqueda}
        onChange={manejarCambioBusqueda}
        className="entrada-busqueda"
      />
      {espaciosFiltrados.length === 0 ? (
        <div className="alerta alerta-info">
          No se encontraron espacios que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="columna-espacio">
          {espaciosFiltrados.map((espacio) => (
            <div key={espacio._id} className="espacio">
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
                <div className="detalles-espacio">
                  <div className="nombre-espacio">{espacio.nombre}</div>
                  <div className="icono-ubicacion">
                    <img className="icono" alt="" src="icons/location.svg" />
                    <div className="direccion-ubicacion">
                      {espacio.direccion}, {espacio.ciudad}
                    </div>
                  </div>
                </div>
                <div className="precio-espacio">
                  <p className="precio">{espacio.precio}</p>
                  <p className="moneda ml-1">ARS</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaEspacios;