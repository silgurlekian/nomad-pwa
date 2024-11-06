import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    // Obtener los espacios de coworking desde el backend en el puerto 5001
    axios.get('http://localhost:5001/api/spaces')
      .then(response => {
        setSpaces(response.data); // Asigna la respuesta a la lista de espacios
      })
      .catch(error => {
        console.error("There was an error fetching the spaces!", error);
      });
  }, []);

  return (
    <div>
      <h1>Nomad Coworking Spaces</h1>
      <div className="spaces">
        {spaces.length === 0 ? (
          <p>No coworking spaces available</p>
        ) : (
          spaces.map(space => (
            <div key={space._id} className="space">
              <h2>{space.name}</h2>
              <p>Address: {space.address}</p>
              <p>Rating: {space.rating}</p>
              <p>Price: ${space.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
