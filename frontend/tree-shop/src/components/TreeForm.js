import React, { useState } from 'react';

export default function TreeForm({ addTree }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTree = { name, description, image };
    addTree(newTree);
    setName('');
    setDescription('');
    setImage('');
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
