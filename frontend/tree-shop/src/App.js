import React, { useState } from 'react';
import './App.css';
import TreeForm from './components/TreeForm';
import TreeList from './components/TreeList';
import axios from 'axios';

function App() {
  const [trees, setTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);

  const addTree = async (newTree) => {
    try {
      const response = await axios.post('http://localhost:5000/trees', newTree);
      setTrees([...trees, { id: response.data.id, ...newTree }]);
    } catch (err) {
      console.error('Lỗi khi thêm cây mới:', err);
    }
  };

  const updateTree = async (updatedTree) => {
    try {
      await axios.put(`http://localhost:5000/trees/${updatedTree.id}`, updatedTree);
      setTrees(trees.map(tree => (tree.id === updatedTree.id ? updatedTree : tree)));
      setSelectedTree(null);  // Reset lại form sau khi cập nhật
    } catch (err) {
      console.error('Lỗi khi cập nhật cây:', err);
    }
  };

  const deleteTree = (id) => {
    setTrees(trees.filter((tree) => tree.id !== id));
  };

  const editTree = (tree) => {
    setSelectedTree(tree);
  };

  return (
    <div className="App">
      <header>
        <h1>Tree Shop</h1>
      </header>
      <TreeForm addTree={addTree} selectedTree={selectedTree} updateTree={updateTree} />
      <TreeList trees={trees} setTrees={setTrees} deleteTree={deleteTree} editTree={editTree} />
    </div>
  );
}

export default App;
