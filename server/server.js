/* =====================================================
 * Server Entry Point
 * Nhà Hàng Phố Cổ - Ninh Bình
 * ===================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const xssFilters = require('xss-filters');
const { testConnection, jsonDB } = require('./config/db');

// Import routes
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================================================
// MIDDLEWARE
// =====================================================

// Helmet - Bảo mật HTTP headers (chống XSS, clickjacking, MIME sniffing)
app.use(helmet({
    contentSecurityPolicy: false, // Tắt CSP để không block inline scripts/styles
    crossOriginEmbedderPolicy: false // Cho phép embed Google Maps
}));

// CORS - Cho phép frontend gọi API
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGIN || '*'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// XSS SANITIZATION MIDDLEWARE
// =====================================================
function sanitizeInput(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        const sanitize = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = xssFilters.inHTMLData(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    sanitize(obj[key]);
                }
            }
        };
        sanitize(req.body);
    }
    next();
}

// Apply XSS sanitization to all POST/PUT requests
app.post('*', sanitizeInput);
app.put('*', sanitizeInput);

// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================
function requireAdmin(req, res, next) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Cần đăng nhập admin' });
    }
    try {
        const decoded = Buffer.from(token.replace('Bearer ', ''), 'base64').toString();
        if (!decoded.startsWith('admin:')) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
        }
        // Token expire after 24h
        const timestamp = parseInt(decoded.split(':')[1]);
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
            return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại' });
        }
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
}

// Rate limiting - chống spam API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // tối đa 100 request / 15 phút
    message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiting nghiêm ngặt hơn cho form submit
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 giờ
    max: 10, // tối đa 10 lần submit / giờ
    message: { success: false, message: 'Bạn đã gửi quá nhiều lần, vui lòng thử lại sau' },
    standardHeaders: true,
    legacyHeaders: false
});

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '..', 'client')));

// Serve uploaded images
const IS_VERCEL = process.env.VERCEL === '1';
const UPLOADS_DIR = IS_VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '..', 'client', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR));

// On Vercel, also serve static uploads from client/uploads (for pre-existing images in repo)
if (IS_VERCEL) {
    const repoUploads = path.join(__dirname, '..', 'client', 'uploads');
    if (fs.existsSync(repoUploads)) {
        app.use('/uploads', express.static(repoUploads));
    }
}

// =====================================================
// IMAGE UPLOAD (Multer)
// =====================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        cb(null, name);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp, svg)'));
    }
});

// API Upload ảnh (yêu cầu admin)
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Không có file ảnh' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url, message: 'Upload thành công' });
});

// =====================================================
// VIDEO UPLOAD (Multer - lớn hơn, tối đa 100MB)
// =====================================================
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        cb(null, name);
    }
});
const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter: (req, file, cb) => {
        const allowed = /mp4|webm|mov|avi|mkv|ogg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = /video/.test(file.mimetype);
        if (ext && mimeOk) cb(null, true);
        else cb(new Error('Chỉ chấp nhận file video (mp4, webm, mov, avi, mkv)'));
    }
});

// API Upload video (yêu cầu admin)
app.post('/api/upload-video', requireAdmin, videoUpload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Không có file video' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url, message: 'Upload video thành công' });
});

// =====================================================
// WEBSITE CONTENT API (Quản lý nội dung trang web)
// =====================================================
const CONTENT_FILE_REPO = path.join(__dirname, '..', 'data', 'content.json');
const CONTENT_FILE = IS_VERCEL
    ? path.join('/tmp', 'data', 'content.json')
    : CONTENT_FILE_REPO;

// On Vercel: copy content.json from repo to /tmp if not exists
if (IS_VERCEL && !fs.existsSync(CONTENT_FILE) && fs.existsSync(CONTENT_FILE_REPO)) {
    const tmpDir = path.dirname(CONTENT_FILE);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.copyFileSync(CONTENT_FILE_REPO, CONTENT_FILE);
}

function readContent() {
    try {
        if (fs.existsSync(CONTENT_FILE)) return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    } catch { }
    // Default content
    return {
        hero: {
            subtitle: 'Chào mừng đến với',
            title: 'Nhà Hàng Phố Cổ',
            tagline: 'Hương vị truyền thống giữa lòng phố cổ Ninh Bình',
            description: 'Trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian mang đậm hồn phố cổ',
            backgroundImage: ''
        },
        about: {
            title: 'Về Nhà Hàng Phố Cổ',
            description: '',
            image: '',
            experience: '15+'
        },
        contact: {
            address: '72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình',
            phone: '0229 123 4567',
            email: 'info@phoconinhbinh.vn',
            openHours: '10:00 - 22:00',
            mapUrl: ''
        },
        introVideo: {
            url: '',
            enabled: false
        },
        gallery: [],
        stats: { customers: 15000, dishes: 50, years: 10, reviews: 4800 },
        testimonials: [],
        offer: { enabled: true, badge: 'Ưu đãi đặc biệt', title: 'Giảm 15% cho đặt bàn Online', desc: '', btnText: 'Đặt Bàn & Nhận Ưu Đãi' },
        floatingContact: { phone: '02293888888', zalo: 'https://zalo.me/0229388888', messenger: 'https://m.me/nhahangphoco' },
        socialLinks: { facebook: '', instagram: '', tiktok: '', zalo: '' },
        footerHours: { weekday: '09:00 - 22:00', saturday: '08:00 - 23:00', sunday: '08:00 - 22:00' }
    };
}

function writeContent(data) {
    const dir = path.dirname(CONTENT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET content
app.get('/api/content', (req, res) => {
    res.json({ success: true, data: readContent() });
});

// PUT content (update) - yêu cầu admin
app.put('/api/content', requireAdmin, express.json(), (req, res) => {
    try {
        const current = readContent();
        const updated = { ...current, ...req.body };
        // Deep merge sections
        if (req.body.hero) updated.hero = { ...current.hero, ...req.body.hero };
        if (req.body.about) updated.about = { ...current.about, ...req.body.about };
        if (req.body.contact) updated.contact = { ...current.contact, ...req.body.contact };
        if (req.body.introVideo) updated.introVideo = { ...current.introVideo, ...req.body.introVideo };
        if (req.body.gallery) updated.gallery = req.body.gallery;
        if (req.body.stats) updated.stats = { ...current.stats, ...req.body.stats };
        if (req.body.testimonials) updated.testimonials = req.body.testimonials;
        if (req.body.offer) updated.offer = { ...current.offer, ...req.body.offer };
        if (req.body.floatingContact) updated.floatingContact = { ...current.floatingContact, ...req.body.floatingContact };
        if (req.body.socialLinks) updated.socialLinks = { ...current.socialLinks, ...req.body.socialLinks };
        if (req.body.footerHours) updated.footerHours = { ...current.footerHours, ...req.body.footerHours };
        writeContent(updated);
        res.json({ success: true, data: updated, message: 'Đã cập nhật nội dung' });
    } catch (error) {
        console.error('Update content error:', error);
        res.status(500).json({ success: false, message: 'Lỗi cập nhật nội dung' });
    }
});

// =====================================================
// ADMIN BASIC AUTH
// =====================================================
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Phoconinhbinh';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Nhahangphoco88888888';

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'admin.html'));
});

// API xác thực admin
app.post('/api/admin/login', express.json(), (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true, token: Buffer.from(`admin:${Date.now()}`).toString('base64') });
    } else {
        res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
    }
});

// =====================================================
// API ROUTES
// =====================================================
app.use('/api/menu', apiLimiter, menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contacts', contactRoutes);

// Áp dụng formLimiter cho POST routes
app.post('/api/reservations', formLimiter);
app.post('/api/contacts', formLimiter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nhà Hàng Phố Cổ API is running' });
});

// =====================================================
// ANALYTICS / STATISTICS API
// =====================================================
app.get('/api/analytics', async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const { readJSON, DB_FILES } = require('./config/db').jsonDB;
        const allReservations = readJSON(DB_FILES.reservations);

        // Filter by period
        let filteredRes = allReservations;
        if (period !== 'all') {
            const days = parseInt(period);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            filteredRes = allReservations.filter(r => new Date(r.created_at) >= cutoff);
        }

        // Calculate revenue from pre-orders
        let totalRevenue = 0;
        let ordersWithPreOrder = 0;
        let totalGuests = 0;
        const dishCount = {};
        const dailyData = {};
        let statusCount = { pending: 0, confirmed: 0, cancelled: 0 };

        filteredRes.forEach(r => {
            // Status count
            statusCount[r.status] = (statusCount[r.status] || 0) + 1;

            // Guests (confirmed only)
            if (r.status === 'confirmed') {
                totalGuests += (r.guests || 0);
            }

            // Pre-order revenue
            let preOrder = r.pre_order;
            if (typeof preOrder === 'string') {
                try { preOrder = JSON.parse(preOrder); } catch (e) { preOrder = null; }
            }

            const dateKey = r.date || (r.created_at ? r.created_at.split('T')[0] : 'unknown');
            if (!dailyData[dateKey]) dailyData[dateKey] = { orders: 0, revenue: 0, guests: 0 };
            dailyData[dateKey].orders++;
            dailyData[dateKey].guests += (r.guests || 0);

            if (preOrder && Array.isArray(preOrder) && preOrder.length > 0) {
                ordersWithPreOrder++;
                let orderTotal = 0;
                preOrder.forEach(item => {
                    const itemRevenue = (item.price || 0) * (item.qty || 1);
                    orderTotal += itemRevenue;
                    // Track dishes
                    const name = item.name || 'Không rõ';
                    if (!dishCount[name]) dishCount[name] = { qty: 0, revenue: 0 };
                    dishCount[name].qty += (item.qty || 1);
                    dishCount[name].revenue += itemRevenue;
                });
                totalRevenue += orderTotal;
                dailyData[dateKey].revenue += orderTotal;
            }
        });

        // Top dishes sorted by quantity
        const topDishes = Object.entries(dishCount)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 10);

        // Daily data sorted by date desc
        const dailySorted = Object.entries(dailyData)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => b.date.localeCompare(a.date));

        res.json({
            success: true,
            data: {
                totalRevenue,
                ordersWithPreOrder,
                avgOrderValue: ordersWithPreOrder > 0 ? Math.round(totalRevenue / ordersWithPreOrder) : 0,
                totalGuests,
                totalReservations: filteredRes.length,
                statusCount,
                topDishes,
                daily: dailySorted
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ success: false, message: 'Lỗi thống kê' });
    }
});

// =====================================================
// API 404 handler - Trả JSON thay vì HTML
// =====================================================
app.all('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint không tồn tại: ${req.method} ${req.originalUrl}`
    });
});

// =====================================================
// SERVE FRONTEND (SPA fallback)
// =====================================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi từ server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// =====================================================
// START SERVER
// =====================================================
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
    async function startServer() {
        await testConnection();
        app.listen(PORT, () => {
            console.log(`🍜 Nhà Hàng Phố Cổ Server đang chạy tại http://localhost:${PORT}`);
            console.log(`📦 Môi trường: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    startServer();
} else {
    // On Vercel, just test connection without listen
    testConnection();
}

// Export app for Vercel serverless
module.exports = app;
