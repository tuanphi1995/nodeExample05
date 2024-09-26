import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios để gửi request

export default function TreeForm({ addTree, selectedTree, updateTree }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isEdit, setIsEdit] = useState(false); // Trạng thái để biết có phải đang sửa không
  const [imageFile, setImageFile] = useState(null); // Tệp ảnh tải lên

  useEffect(() => {
    if (selectedTree) {
      setName(selectedTree.name);
      setDescription(selectedTree.description);
      setImage(selectedTree.image);
      setIsEdit(true); // Đang chỉnh sửa
    }
  }, [selectedTree]);

  const handleImageUpload = (e) => {
    // Lưu tệp ảnh vào state khi người dùng chọn ảnh
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = image;

    // Nếu người dùng tải lên ảnh mới, upload ảnh lên backend
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile); // Đính kèm tệp ảnh vào FormData

      try {
        // Gửi yêu cầu upload ảnh tới API backend
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Lấy URL ảnh trả về từ backend
        imageUrl = response.data.imageUrl;
      } catch (err) {
        console.error('Lỗi khi upload ảnh:', err);
      }
    }

    // Tạo đối tượng cây với URL ảnh
    const tree = { name, description, image: imageUrl };

    if (isEdit) {
      updateTree({ ...tree, id: selectedTree.id });
    } else {
      addTree(tree);
    }

    // Reset lại form sau khi thêm/sửa
    setName('');
    setDescription('');
    setImage('');
    setImageFile(null);
    setIsEdit(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Tree Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

      <label>Image</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} required />

      <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
      <button type="reset" onClick={() => { setName(''); setDescription(''); setImage(''); setImageFile(null); setIsEdit(false); }}>Reset</button>
    </form>
  );
}
