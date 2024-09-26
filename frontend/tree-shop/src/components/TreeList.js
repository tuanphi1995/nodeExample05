import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa'; // Import các biểu tượng từ React Icons

export default function TreeList({ trees, setTrees, deleteTree, editTree }) {
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

  const handleEdit = (tree) => {
    // Gọi hàm editTree để cập nhật trạng thái cho form
    editTree(tree);
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
              <td className="actions">
                {/* Nút xóa với biểu tượng thùng rác */}
                <button onClick={() => handleDelete(tree.id)}>
                  <FaTrash />
                </button>
                {/* Nút sửa với biểu tượng cây bút */}
                <button onClick={() => handleEdit(tree)}>
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
