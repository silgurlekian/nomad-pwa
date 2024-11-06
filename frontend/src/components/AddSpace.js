import React, { useState } from 'react';
import axios from 'axios';

const AddSpace = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSpace = {
      name,
      address,
      rating: parseFloat(rating),
      price: parseFloat(price)
    };

    try {
      const response = await axios.post('http://localhost:5000/api/spaces', newSpace);
      console.log('Space added:', response.data);
      // Limpiar el formulario
      setName('');
      setAddress('');
      setRating('');
      setPrice('');
    } catch (error) {
      console.error('There was an error adding the space!', error);
    }
  };

  return (
    <div>
      <h2>Add a New Coworking Space</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Space</button>
      </form>
    </div>
  );
};

export default AddSpace;
