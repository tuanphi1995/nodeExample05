const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Sử dụng file JSON tài khoản dịch vụ từ Firebase
const serviceAccount = require('/Users/macbookprocuaphi/Documents/nodeExample05/nodeExample05/node/nodeexample04-firebase-adminsdk-v0m7o-e244634430.json'); // Thay bằng đường dẫn thực tế

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

// Kiểm tra kết nối đến Firestore
db.collection('trees').get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('Không tìm thấy dữ liệu trong collection "trees".');
        } else {
            console.log('Kết nối thành công tới Firestore. Dữ liệu trong "trees":');
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        }
    })
    .catch(err => {
        console.error('Lỗi kết nối tới Firestore:', err);
    });

// Route để lấy dữ liệu từ Firebase
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
