const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer'); // Import multer để xử lý file upload
const path = require('path'); // Import path để làm việc với file hệ thống

// Sử dụng file JSON tài khoản dịch vụ từ Firebase
const serviceAccount = require('/Users/macbookprocuaphi/Documents/nodeExample05/nodeExample05/node/nodeexample04-firebase-adminsdk-v0m7o-193fa06c5b.json'); // Thay bằng đường dẫn thực tế

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Khởi tạo Firestore
const db = admin.firestore();

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Phục vụ các file tĩnh từ thư mục "public"
app.use(express.static('public'));

// Cấu hình Multer để lưu file vào thư mục "public/images"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Thư mục lưu file upload
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file với thời gian hiện tại để tránh trùng lặp
    }
});
const upload = multer({ storage: storage });

// Route upload ảnh
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Gửi lại URL đầy đủ của ảnh đã tải lên
    const imageUrl = `http://localhost:5000/images/${req.file.filename}`; // Trả về URL đầy đủ để sử dụng
    res.json({ imageUrl });
});

// Kiểm tra kết nối đến Firestore và lấy danh sách cây
app.get('/trees', async (req, res) => {
    try {
        const snapshot = await db.collection('trees').get();
        const trees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(trees);
    } catch (err) {
        res.status(500).send('Lỗi khi lấy dữ liệu');
    }
});

// Route để thêm cây mới
app.post('/trees', async (req, res) => {
    try {
        const { name, description, image } = req.body;
        const docRef = await db.collection('trees').add({ name, description, image });
        res.json({ id: docRef.id });
    } catch (err) {
        res.status(500).send('Lỗi khi thêm cây mới');
    }
});

// Route để cập nhật cây
app.put('/trees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image } = req.body;
        await db.collection('trees').doc(id).update({ name, description, image });
        res.json({ id });
    } catch (err) {
        res.status(500).send('Lỗi khi cập nhật cây');
    }
});

// Route để xóa cây
app.delete('/trees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('trees').doc(id).delete();
        res.json({ id });
    } catch (err) {
        res.status(500).send('Lỗi khi xóa cây');
    }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
