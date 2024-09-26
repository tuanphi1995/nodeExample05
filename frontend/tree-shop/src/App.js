import React, { useState } from 'react';
import './App.css';
import TreeForm from './components/TreeForm';
import TreeList from './components/TreeList';

function App() {
  const [trees, setTrees] = useState([]);

  const addTree = (newTree) => {
    setTrees([...trees, newTree]);
  };

  const deleteTree = (id) => {
    setTrees(trees.filter((tree, index) => index !== id));
  };

  return (
    <div className="App">
      <header>
        <h1>Tree Shop</h1>
      </header>
      <TreeForm addTree={addTree} />
      <TreeList trees={trees} deleteTree={deleteTree} />
    </div>
  );
}

export default App;
