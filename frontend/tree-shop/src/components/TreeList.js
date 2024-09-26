import React, { useEffect } from 'react';
import axios from 'axios';  // Sử dụng axios để gọi API

export default function TreeList({ trees, setTrees, deleteTree }) {
  useEffect(() => {
    // Gọi API để lấy dữ liệu cây từ Firestore thông qua Node.js
    const fetchTrees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/trees');
        setTrees(response.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách cây:', err);
      }
    };

    fetchTrees();
  }, [setTrees]);

  const handleDelete = async (id) => {
    try {
      // Gửi DELETE request để xóa cây
      await axios.delete(`http://localhost:5000/trees/${id}`);
      deleteTree(id);
    } catch (err) {
      console.error('Lỗi khi xóa cây:', err);
    }
  };

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
          {trees.map((tree) => (
            <tr key={tree.id}>
              <td>{tree.id}</td>
              <td>{tree.name}</td>
              <td><img src={tree.image} alt={tree.name} width="50" /></td>
              <td>{tree.description}</td>
              <td>
                <button onClick={() => handleDelete(tree.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
