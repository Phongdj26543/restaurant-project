/* =====================================================
 * Database Configuration
 * Hỗ trợ MySQL hoặc JSON file fallback
 * Nhà Hàng Phố Cổ - Ninh Bình
 * ===================================================== */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let useMySQL = false;

// =====================================================
// JSON FILE STORAGE (fallback khi không có MySQL)
// =====================================================
const IS_VERCEL = process.env.VERCEL === '1';
const REPO_DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : REPO_DATA_DIR;

// On Vercel: copy initial data from repo to /tmp (writable)
if (IS_VERCEL && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    // Copy existing data files from repo
    if (fs.existsSync(REPO_DATA_DIR)) {
        const files = fs.readdirSync(REPO_DATA_DIR);
        files.forEach(file => {
            const src = path.join(REPO_DATA_DIR, file);
            const dest = path.join(DATA_DIR, file);
            if (!fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
            }
        });
    }
}
const DB_FILES = {
    menu: path.join(DATA_DIR, 'menu.json'),
    reservations: path.join(DATA_DIR, 'reservations.json'),
    contacts: path.join(DATA_DIR, 'contacts.json')
};

// Memory cache cho Vercel (giữ data giữa các request trong cùng instance)
const memoryCache = {};

// Đọc file JSON (có memory cache)
function readJSON(file) {
    // Return from cache if available
    if (memoryCache[file]) return memoryCache[file];
    try {
        if (!fs.existsSync(file)) return [];
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        memoryCache[file] = data;
        return data;
    } catch { return []; }
}

// Ghi file JSON (cập nhật cả cache)
function writeJSON(file, data) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    memoryCache[file] = data;
}

const jsonDB = { readJSON, writeJSON, DB_FILES };

// =====================================================
// Khởi tạo: thử MySQL trước, fallback sang JSON
// =====================================================
async function testConnection() {
    try {
        const mysql = require('mysql2/promise');
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'nhahangphoconb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: 'utf8mb4'
        });
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công!');
        connection.release();
        useMySQL = true;
    } catch (error) {
        console.warn('⚠️  MySQL không khả dụng:', error.message);
        console.log('📁 Sử dụng JSON file storage thay thế');
        useMySQL = false;
        initJSONData();
    }
}

// Khởi tạo dữ liệu mẫu cho JSON storage
function initJSONData() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

    // Tạo menu mẫu nếu chưa có
    if (!fs.existsSync(DB_FILES.menu) || readJSON(DB_FILES.menu).length === 0) {
        const menuData = [
            { id: 1, name: 'Cơm cháy Ninh Bình', description: 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt, đặc sản nổi tiếng Ninh Bình', price: 120000, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 2, name: 'Thịt dê tái chanh', description: 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa', price: 180000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 3, name: 'Thịt dê nướng tảng', description: 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa', price: 200000, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 4, name: 'Miến lươn Ninh Bình', description: 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh', price: 85000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 5, name: 'Ốc núi Ninh Bình', description: 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên', price: 95000, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', category: 'Đặc sản Ninh Bình', is_active: 1 },
            { id: 6, name: 'Nem rán truyền thống', description: 'Nem rán giòn rụm với nhân thịt và mộc nhĩ, chấm nước mắm pha', price: 75000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category: 'Khai vị', is_active: 1 },
            { id: 7, name: 'Gỏi cuốn tôm thịt', description: 'Gỏi cuốn tươi mát với tôm, thịt và rau sống', price: 65000, image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=400', category: 'Khai vị', is_active: 1 },
            { id: 8, name: 'Chả giò hải sản', description: 'Chả giò chiên giòn với nhân hải sản tươi', price: 85000, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', category: 'Khai vị', is_active: 1 },
            { id: 9, name: 'Cá kho tộ', description: 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng', price: 150000, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', category: 'Món chính', is_active: 1 },
            { id: 10, name: 'Gà đồi nướng mật ong', description: 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm', price: 250000, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', category: 'Món chính', is_active: 1 },
            { id: 11, name: 'Tôm sú rang muối', description: 'Tôm sú tươi rang muối ớt, thơm ngon hấp dẫn', price: 220000, image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', category: 'Món chính', is_active: 1 },
            { id: 12, name: 'Lẩu dê Ninh Bình', description: 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà', price: 350000, image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400', category: 'Lẩu', is_active: 1 },
            { id: 13, name: 'Lẩu hải sản chua cay', description: 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt', price: 320000, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400', category: 'Lẩu', is_active: 1 },
            { id: 14, name: 'Trà sen Ninh Bình', description: 'Trà ướp hương sen tự nhiên, thanh mát', price: 35000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', category: 'Đồ uống', is_active: 1 },
            { id: 15, name: 'Nước mía lau', description: 'Nước mía lau tươi mát, giải nhiệt', price: 25000, image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400', category: 'Đồ uống', is_active: 1 },
            { id: 16, name: 'Bia hơi Hà Nội', description: 'Bia hơi tươi mát, đặc sản vùng miền', price: 15000, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', category: 'Đồ uống', is_active: 1 }
        ];
        writeJSON(DB_FILES.menu, menuData);
        console.log('📋 Đã tạo dữ liệu thực đơn mẫu');
    }

    // Tạo file rỗng cho reservations & contacts
    if (!fs.existsSync(DB_FILES.reservations)) writeJSON(DB_FILES.reservations, []);
    if (!fs.existsSync(DB_FILES.contacts)) writeJSON(DB_FILES.contacts, []);
}

function isMySQL() { return useMySQL; }

module.exports = { pool: () => pool, testConnection, jsonDB, isMySQL };
