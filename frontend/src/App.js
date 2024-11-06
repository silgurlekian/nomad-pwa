import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Asegúrate de importar el archivo CSS

function App() {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/spaces')
      .then(response => {
        setSpaces(response.data); // Asigna la respuesta a la lista de espacios
      })
      .catch(error => {
        console.error("There was an error fetching the spaces!", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Lista de Espacios de Coworking</h1>
      <div className="container">
        {spaces.map(space => (
          <div key={space._id} className="space card">
            <div className="card-body">
              <h2 className="card-title">{space.name}</h2>
              <p className="card-text">Dirección: {space.address}</p>
              <p className="card-text">Rating: {space.rating}</p>
              <p className="card-text">Precio: ${space.price}</p>
              <div>
                <h3>Servicios:</h3>
                <ul>
                  {space.services.map(service => (
                    <li key={service._id} className="list-group-item">
                      {service.name} - {service.description}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
