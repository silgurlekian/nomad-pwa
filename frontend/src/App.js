import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading status
  const [error, setError] = useState(null); // New state for handling errors

  useEffect(() => {
    axios.get('http://localhost:3000/api/spaces')
      .then(response => {
        setSpaces(response.data); // Asigna la respuesta a la lista de espacios
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch(error => {
        console.error("There was an error fetching the spaces!", error);
        setError(error); // Set error state if request fails
        setLoading(false); // Set loading to false if request fails
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Show error message if there was a problem
  }

  return (
    <div className="App">
      <h1>Lista de Espacios de Coworking</h1>
      {spaces.length === 0 ? (
        <p>No spaces found</p> // Message if no spaces are found
      ) : (
        spaces.map(space => (
          <div key={space._id} className="space">
            <h2>{space.name}</h2>
            <p>Address: {space.address}</p>
            <p>Rating: {space.rating}</p>
            <p>Price: ${space.price}</p>
            <div>
              <h3>Services:</h3>
              {space.services.length > 0 ? (
                <ul>
                  {space.services.map(service => (
                    <li key={service._id}>{service.name} - {service.description}</li>
                  ))}
                </ul>
              ) : (
                <p>No services available</p> // Message if no services are available
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
