import React from 'react';

export default function TreeList({ trees, deleteTree }) {
  return (
    <div className="tree-list">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trees.map((tree, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{tree.name}</td>
              <td><img src={tree.image} alt={tree.name} width="50" /></td>
              <td>{tree.description}</td>
              <td>
                <button onClick={() => deleteTree(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
