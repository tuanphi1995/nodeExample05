const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer'); // Import multer để xử lý file upload
const path = require('path'); // Import path để làm việc với file hệ thống
const { getStorage } = require('firebase-admin/storage'); // Firebase Storage
const { v4: uuidv4 } = require('uuid'); // Import uuid để tạo token

// Sử dụng file JSON tài khoản dịch vụ từ Firebase
const serviceAccount = require('/Users/macbookprocuaphi/Documents/nodeExample05/nodeExample05/node/nodeexample04-firebase-adminsdk-v0m7o-193fa06c5b.json'); // Thay bằng đường dẫn thực tế

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "nodeexample04.appspot.com" // Thay bằng ID bucket Firebase Storage của bạn
});

// Khởi tạo Firestore và Storage
const db = admin.firestore();
const bucket = getStorage().bucket();

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cấu hình Multer để lưu file vào bộ nhớ (RAM)
const storage = multer.memoryStorage(); // Lưu trữ tạm thời trong bộ nhớ RAM
const upload = multer({ storage: storage });

// Hàm tạo token ngẫu nhiên
const generateRandomToken = () => {
    return uuidv4(); // Sử dụng uuid để tạo token ngẫu nhiên
};

// Route upload ảnh lên Firebase Storage
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const blob = bucket.file(Date.now() + path.extname(req.file.originalname));
    const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
            contentType: req.file.mimetype
        }
    });

    blobStream.on('error', (err) => {
        console.error('Lỗi khi tải file lên Firebase Storage:', err);
        res.status(500).send('Lỗi khi tải file lên Firebase Storage.');
    });

    blobStream.on('finish', async () => {
        const token = generateRandomToken();  // Tạo token tùy chỉnh
        await blob.setMetadata({
            metadata: {
                firebaseStorageDownloadTokens: token, // Thêm token vào metadata của tệp
            }
        });
        
        // Tạo URL công khai với token truy vấn
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${token}`;
        res.json({ imageUrl: publicUrl }); // Trả về URL ảnh cho frontend
    });

    blobStream.end(req.file.buffer);
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
