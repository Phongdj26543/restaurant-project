/* =====================================================
 * Database Configuration
 * Hỗ trợ MongoDB (primary) + JSON file fallback
 * Nhà Hàng Phố Cổ - Ninh Bình
 * ===================================================== */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

let useMongo = false;
let mongoConnected = false;
let mongoConnectionError = '';

// =====================================================
// MONGODB CONNECTION
// =====================================================
const MONGODB_URI = process.env.MONGODB_URI || '';

async function connectMongoDB() {
    if (!MONGODB_URI) {
        mongoConnectionError = 'MONGODB_URI không được cấu hình';
        console.log('⚠️  ' + mongoConnectionError);
        return false;
    }

    // Nếu đã kết nối rồi thì dùng luôn
    if (mongoose.connection.readyState === 1) {
        useMongo = true;
        mongoConnected = true;
        mongoConnectionError = '';
        console.log('♻️  Tái sử dụng kết nối MongoDB');
        return true;
    }

    try {
        console.log('🔌 Kết nối MongoDB...');

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 30000,
            connectTimeoutMS: 15000,
            maxPoolSize: 5,
            bufferCommands: true,
        });

        console.log('✅ Kết nối MongoDB thành công!');
        useMongo = true;
        mongoConnected = true;
        mongoConnectionError = '';

        // Seed dữ liệu mẫu nếu DB trống
        await seedInitialData();

        return true;
    } catch (error) {
        mongoConnectionError = error.message;
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        useMongo = false;
        mongoConnected = false;
        return false;
    }
}

// Lắng nghe sự kiện kết nối MongoDB
mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB connected event');
    useMongo = true;
    mongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected event');
    mongoConnected = false;
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error event:', err.message);
    mongoConnectionError = err.message;
});

// Export trạng thái để health check
function getDbStatus() {
    return {
        mongoConfigured: !!MONGODB_URI,
        mongoConnected: useMongo && mongoConnected,
        mongoState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
        mongoError: mongoConnectionError || null,
        usingMongo: isMongo(),
        mongoUri: MONGODB_URI ? MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@') : 'not set'
    };
}

// =====================================================
// MONGOOSE SCHEMAS
// =====================================================
const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true },
    is_active: { type: Number, default: 1 }
}, { timestamps: true });

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    note: { type: String, default: null },
    pre_order: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'cancelled'] },
    created_at: { type: Date, default: Date.now }
}, { timestamps: false });

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: null },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
}, { timestamps: false });

const contentSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true }
}, { timestamps: true });

// Tạo models
const MenuModel = mongoose.model('Menu', menuSchema);
const ReservationModel = mongoose.model('Reservation', reservationSchema);
const ContactModel = mongoose.model('Contact', contactSchema);
const ContentModel = mongoose.model('Content', contentSchema);
const ImageModel = mongoose.model('Image', imageSchema);

// =====================================================
// JSON FILE STORAGE (fallback khi không có MongoDB)
// =====================================================
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

const DB_FILES = {
    menu: path.join(DATA_DIR, 'menu.json'),
    reservations: path.join(DATA_DIR, 'reservations.json'),
    contacts: path.join(DATA_DIR, 'contacts.json')
};

const memoryCache = {};

function readJSON(file) {
    if (memoryCache[file]) return memoryCache[file];
    try {
        if (!fs.existsSync(file)) return [];
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        memoryCache[file] = data;
        return data;
    } catch { return []; }
}

function writeJSON(file, data) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    memoryCache[file] = data;
}

const jsonDB = { readJSON, writeJSON, DB_FILES };

// =====================================================
// SEED DỮ LIỆU MẪU VÀO MONGODB (chỉ khi DB trống)
// =====================================================
async function seedInitialData() {
    try {
        const menuCount = await MenuModel.countDocuments();
        if (menuCount === 0) {
            const menuData = [
                { name: 'Cơm cháy Ninh Bình', description: 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt, đặc sản nổi tiếng Ninh Bình', price: 120000, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
                { name: 'Thịt dê tái chanh', description: 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa', price: 180000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
                { name: 'Thịt dê nướng tảng', description: 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa', price: 200000, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
                { name: 'Miến lươn Ninh Bình', description: 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh', price: 85000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
                { name: 'Ốc núi Ninh Bình', description: 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên', price: 95000, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
                { name: 'Nem rán truyền thống', description: 'Nem rán giòn rụm với nhân thịt và mộc nhĩ, chấm nước mắm pha', price: 75000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Khai vị', is_active: 1 },
                { name: 'Gỏi cuốn tôm thịt', description: 'Gỏi cuốn tươi mát với tôm, thịt và rau sống', price: 65000, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400', category: 'Khai vị', is_active: 1 },
                { name: 'Chả giò hải sản', description: 'Chả giò chiên giòn với nhân hải sản tươi', price: 85000, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', category: 'Khai vị', is_active: 1 },
                { name: 'Cá kho tộ', description: 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng', price: 150000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'Món chính', is_active: 1 },
                { name: 'Gà đồi nướng mật ong', description: 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm', price: 250000, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', category: 'Món chính', is_active: 1 },
                { name: 'Tôm sú rang muối', description: 'Tôm sú tươi rang muối ớt, thơm ngon hấp dẫn', price: 220000, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', category: 'Món chính', is_active: 1 },
                { name: 'Lẩu dê Ninh Bình', description: 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà', price: 350000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Lẩu', is_active: 1 },
                { name: 'Lẩu hải sản chua cay', description: 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt', price: 320000, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400', category: 'Lẩu', is_active: 1 },
                { name: 'Trà sen Ninh Bình', description: 'Trà ướp hương sen tự nhiên, thanh mát', price: 35000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', category: 'Đồ uống', is_active: 1 },
                { name: 'Nước mía lau', description: 'Nước mía lau tươi mát, giải nhiệt', price: 25000, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400', category: 'Đồ uống', is_active: 1 },
                { name: 'Bia hơi Hà Nội', description: 'Bia hơi tươi mát, đặc sản vùng miền', price: 15000, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', category: 'Đồ uống', is_active: 1 }
            ];
            await MenuModel.insertMany(menuData);
            console.log('📋 Đã seed dữ liệu thực đơn mẫu vào MongoDB');
        }

        // Seed content mặc định nếu chưa có
        const contentDoc = await ContentModel.findOne({ key: 'main' });
        if (!contentDoc) {
            const defaultContent = {
                hero: {
                    subtitle: 'Chào mừng đến với',
                    title: 'Nhà Hàng Phố Cổ',
                    tagline: 'Hương vị truyền thống giữa lòng phố cổ Ninh Bình',
                    description: 'Trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian mang đậm hồn phố cổ',
                    backgroundImage: ''
                },
                about: { title: 'Về Nhà Hàng Phố Cổ', description: '', image: '', experience: '15+' },
                contact: { address: '72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình', phone: '0229 123 4567', email: 'info@phoconinhbinh.vn', openHours: '10:00 - 22:00', mapUrl: '' },
                introVideo: { url: '', enabled: false },
                gallery: [],
                stats: { customers: 15000, dishes: 50, years: 10, reviews: 4800 },
                testimonials: [],
                offer: { enabled: true, badge: 'Ưu đãi đặc biệt', title: 'Giảm 15% cho đặt bàn Online', desc: '', btnText: 'Đặt Bàn & Nhận Ưu Đãi' },
                floatingContact: { phone: '02293888888', zalo: 'https://zalo.me/0229388888', messenger: 'https://m.me/nhahangphoco' },
                socialLinks: { facebook: '', instagram: '', tiktok: '', zalo: '' },
                footerHours: { weekday: '09:00 - 22:00', saturday: '08:00 - 23:00', sunday: '08:00 - 22:00' }
            };

            // Nếu có file content.json local, dùng nó thay vì default
            const localContentFile = path.join(DATA_DIR, 'content.json');
            let seedData = defaultContent;
            try {
                if (fs.existsSync(localContentFile)) {
                    seedData = JSON.parse(fs.readFileSync(localContentFile, 'utf8'));
                    console.log('📄 Seed content từ file content.json local');
                }
            } catch { }

            await ContentModel.create({ key: 'main', data: seedData });
            console.log('📄 Đã seed nội dung mặc định vào MongoDB');
        }
    } catch (error) {
        console.error('Lỗi seed data:', error.message);
    }
}

// =====================================================
// Khởi tạo: thử MongoDB → fallback JSON
// =====================================================
async function testConnection() {
    // Ưu tiên MongoDB
    const mongoOk = await connectMongoDB();
    if (mongoOk) {
        console.log('🗄️  Sử dụng MongoDB Atlas làm database chính');
        return;
    }

    // Fallback sang JSON
    console.log('📁 Sử dụng JSON file storage thay thế');
    initJSONData();
}

function initJSONData() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILES.menu) || readJSON(DB_FILES.menu).length === 0) {
        const menuData = [
            { id: 1, name: 'Cơm cháy Ninh Bình', description: 'Cơm cháy giòn tan', price: 120000, image: '', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 2, name: 'Thịt dê tái chanh', description: 'Thịt dê tươi thái mỏng', price: 180000, image: '', category: 'Đặc sản Ninh Bình', is_active: 1 }
        ];
        writeJSON(DB_FILES.menu, menuData);
    }
    if (!fs.existsSync(DB_FILES.reservations)) writeJSON(DB_FILES.reservations, []);
    if (!fs.existsSync(DB_FILES.contacts)) writeJSON(DB_FILES.contacts, []);
}

function isMongo() {
    // Kiểm tra cả readyState để đảm bảo connection thực sự sống
    const ready = mongoose.connection.readyState === 1;
    if (useMongo && !ready) {
        console.warn('⚠️ isMongo: useMongo=true nhưng readyState=' + mongoose.connection.readyState);
        mongoConnected = false;
    }
    return useMongo && ready;
}

module.exports = {
    testConnection,
    jsonDB,
    isMongo,
    getDbStatus,
    // Mongoose models export
    MenuModel,
    ReservationModel,
    ContactModel,
    ContentModel,
    ImageModel
};
