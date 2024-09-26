import React, { useState } from 'react';
import axios from 'axios';  // Sử dụng axios để gửi request

export default function TreeForm({ addTree }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTree = { name, description, image };

    try {
      // Gửi POST request tới API Node.js để thêm cây mới
      const response = await axios.post('http://localhost:5000/trees', newTree);
      addTree({ id: response.data.id, ...newTree });
      setName('');
      setDescription('');
      setImage('');
    } catch (err) {
      console.error('Lỗi khi thêm cây mới:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Tree Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

      <label>Image</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />

      <button type="submit">Add</button>
      <button type="reset" onClick={() => { setName(''); setDescription(''); setImage(''); }}>Reset</button>
    </form>
  );
}
